<?php

namespace app\Models;

use Server\CoreBase\Model;

class Logic extends Model
{

	private $userDataM = null;
	private $level = 1;
	private $addEnergy = 10;
	private $tmp_head_counts = 500;
	private $max_level = 20;

	private $probCfg = [
		[
			'flag'=>'eaten',
			'prob'=>5,
			'range'=> [1,3],
			'coastPre'=>0.05,
		],
		[
			'flag'=>'passBy',
			'prob'=> 55,
			'range'=>['1',3],
			'coastPre'=>0.01,
		],
		[
			'flag'=>'eat',
			'prob'=> 20,
			'range'=>[-4,-1],
			'coastPre'=>0.05,
		],
		[
			'flag'=>'meet',
			'prob'=> 20,
			'range'=>['1',3],
			'coastPre'=>0.02,
		],
	];

	public function initialization(&$context)
	{
	    parent::initialization($context);
	   	$this->userDataM = $this->loader->model('UserData',$this);
	}

	private function get_fish_show_way()
    {
    	$arr = [5,75,0,20];
    	if($this->level >= $this->max_level)
    	{
    		$arr = [0,60,20,20];
    	}
    	if($this->level > 1 && $this->level < $this->max_level)
    	{
    		foreach ($this->probCfg as $key => $value) {
	    		$arr[$key] = $value['prob'];
	    	}
    	}

        $pro_sum=array_sum($arr);
        $rand_num= mt_rand(1,$pro_sum);
        $tmp_num=0;
        $n = null;
        foreach($arr as $k=>$val)
        {    
            if($rand_num<=$val+$tmp_num)
            {
                $n=$k;
                break;
            }else
            {
                $tmp_num+=$val;
            }
        }
        return $this->probCfg[$n];
    }

    private function check_str($str, $sub_str)
    {
    	$counts = substr_count($str, $sub_str);

    	if($counts > 0)
    	{
    		return true;
    	}

    	return false;
    }

    private function rand_level($cfg,$flag)
    {
    	$min = is_string($cfg['range'][0]) ? (int)($cfg['range'][0]) : $this->level + $cfg['range'][0];
    	$min = $min > $this->max_level ? $this->max_level : $min;
    	if($flag == 'eat' && $min < 1)
    	{
    		$min = 1;
    	}
    	$max = is_string($cfg['range'][1]) ? (int)($cfg['range'][1]) : $this->level + $cfg['range'][1];
    	$max = $max > $this->max_level ? $this->max_level : $max;
    	return mt_rand($min,$max);
    }
	
	private function buildFishData($id)
	{
		$tmp_array = [];
		$curConfig = $this->get_fish_show_way();
		$tmp_array['flag'] = $curConfig['flag'];
		// build level
		$level = $this->rand_level($curConfig,$curConfig['flag']);
		$tmp_array['level'] = $level;
		$tmp_array['fish_index'] = $level;
		$tmp_array['coast_coin'] = $this->getFishListPrice()[$level] * $curConfig['coastPre'];
		if($tmp_array['flag'] == 'eaten') {
			$tmp_array['coast_coin'] = - $tmp_array['coast_coin'];
		}

		$tmp_array['flee_counts'] = $curConfig['flag'] == 'eaten' ? mt_rand(1,$level) : 0;

		// deal user data
		$this->userDataM->setValByKey($id,'coast_coin',(string)($tmp_array['coast_coin']));
		$this->userDataM->setValByKey($id,'coast_energy',(string)-1);
		$this->userDataM->setValByKey($id, 'flee_counts',(string)$tmp_array['flee_counts']);
		// calc user energy data
		$energy = (int)($this->userDataM->getValByKey($id,'energy'));
		$coast_energy = (int)($this->userDataM->getValByKey($id,'coast_energy'));
		if($energy + $coast_energy < 0)
		{
			$coast_energy = -$energy;
		}
		$this->userDataM->incrValByKey($id,'energy',$coast_energy);
		$maxEnergy = (int)($this->userDataM->getValByKey($id,'maxEnergy'));
		if($energy == $maxEnergy - 1) {
			$this->userDataM->setValByKey($id,'start_flock_energy_time',(string)time());
		}

		// add user data to new fish data
		$tmp_array['user'] = $this->getUserInfo($id,true);

		// add nick name and head url logic
		$tmp_nickName_list = $this->userDataM->get('tmpNickNameList');
		$tmp_nickName_list = json_decode($tmp_nickName_list,true);
		$nickName_index = mt_rand(0,count($tmp_nickName_list)-1);
		$tmp_array['nick_name'] = $tmp_nickName_list[$nickName_index];
		$tmp_array['head_url'] = 'head/' . (string)mt_rand(1,$this->tmp_head_counts) . '.jpg';
		// flee_counts //// to do
		
		return $tmp_array;
	}

	public function deal_last_fish_data($id, $result)
	{
		if(!$result || !$id) return;
		$res = json_decode($result,true);
		if(!$res['type']) return;
		switch ($res['type']) {
			case 'passBy':
			case 'meet':
			case 'eat':
			case 'eaten':
				$coast_coin = (int)($this->userDataM->getValByKey($id,'coast_coin'));
				$coin = (int)($this->userDataM->getValByKey($id,'coin'));
				
				if($coin + $coast_coin < 0)
				{
					$coast_coin = -$coin;
				}
				$this->userDataM->incrValByKey($id,'coin',$coast_coin);
				break;
			case 'flee':
				$flee_counts = -(int)($this->userDataM->getValByKey($id,'flee_counts'));
				$energy = (int)($this->userDataM->getValByKey($id, 'energy'));
				if($energy + $flee_counts < 0)
				{
					$flee_counts = -$energy;
				}
				$this->userDataM->incrValByKey($id,'energy',$flee_counts);
				break;
			case 'first':
				// undo
				break;
			default:
				// to do
				break;
		}
	}

	public function buildNewFish($id, $last_result)
	{
		$this->deal_last_fish_data($id, $last_result);
		$energy = (int)($this->userDataM->getValByKey($id,'energy'));
		if($energy <= 0)
		{
			return '-1';
		}
		// init data
		$this->level = (int)($this->userDataM->getValByKey($id,'level'));
		// logic
		return json_encode($this->buildFishData($id),true);
	}

	public function getFishListPrice()
	{
		$val = $this->userDataM->get('priceList');
		if($val)
		{
			return json_decode($val,true);
		} 
		else {
			$priceList = [];
			for ($i=1; $i < 21; $i++) {
				$priceList[$i] = (pow($i, 2) - $i + 2) * 50;
			}
			$this->userDataM->set('priceList',json_encode($priceList));
			return $priceList;
		}
	}

	public function getUserInfo($id, $is_self=false)
	{
		$result = $this->userDataM->getUserInfoById($id);
		if(!$is_self)
		{
			$result['fishPrice'] = $this->getFishListPrice();
			$result['eatPriceMul'] = 0.02;
			$result['passByMul'] = 0.01;
			$result['meetMul'] = 0.05;
			$result['eatenPriceMul'] = 0.02;
			return json_encode($result);
		} 
		else {
			return $result;
		}
	}

	public function finishEat($id)
	{
		$coast_coin = (int)($this->userDataM->getValByKey($id,'coast_coin'));
		$coin = (int)($this->userDataM->getValByKey($id,'coin'));
		
		if($coin + $coast_coin < 0)
		{
			$coast_coin = -$coin;
		}
		$this->userDataM->incrValByKey($id,'coin',$coast_coin);
		return '1';
	}

	public function flee($id)
	{
		$energy = (int)($this->userDataM->getValByKey($id,'energy'));
		// $flee_energy = (int)($this->userDataM->getValByKey($id,'flee_counts'));
		$coast = -1;
		if($energy + $coast < 0)
		{
			$coast = -$energy;
		}
		if($coast == 0) {
			return '-1';
		}
		$this->userDataM->incrValByKey($id,'energy',$coast);
		return '1';
	}

	public function flockEnergy($id)
	{
		$energy = (int)($this->userDataM->getValByKey($id,'energy'));
		$maxEnergy = (int)($this->userDataM->getValByKey($id,'maxEnergy'));

		$start_time = time();

		$res = $this->userDataM->getValByKey($id,'start_flock_energy_time');
 
		if(!$res) {
			$this->userDataM->setValByKey($id,'start_flock_energy_time',(string)$start_time);
			$res = $start_time;
		}
		
		if($energy < $maxEnergy)
		{
			$intervalTime = 3600;
			$res = (int)$res;
			$mul = (int)(($start_time - $res) / $intervalTime);

			if($mul >= 1)
			{
				$val = $mul * $this->addEnergy;
				$val = ($val + $energy) > $maxEnergy ? $maxEnergy - $energy : $val;
				$this->userDataM->incrValByKey($id,'energy',$val);
				$this->userDataM->setValByKey($id,'start_flock_energy_time',(string)$start_time);
				$result = ['add_energy'=>$val];
				return json_encode($result);
			}
			return json_encode($intervalTime - ((int)($start_time - $res)));
		}     
		else {
			return '-1';
		}
	}

	public function upgrade($id)
	{
		$curLevel = (int)($this->userDataM->getValByKey($id,'level'));
		$coin = (int)($this->userDataM->getValByKey($id,'coin'));
		$price = $this->getFishListPrice()[$curLevel + 1];

		if($coin - $price >= 0)
		{
			$zoom = (float)$this->userDataM->getValByKey($id,'zoom');
			$zoom = round(($zoom - ($zoom - 0.5) * 0.1),2);
			$this->userDataM->setValByKey($id,'zoom',(string)$zoom);
			$this->userDataM->incrValByKey($id,'coin',-$price);
			$this->userDataM->incrValByKey($id,'level',1);
			$this->userDataM->incrValByKey($id,'fishIndex',1);
			return '1';
		}
		return '-1';
	}

	public function saveUserInfo($id, $userInfo)
	{
		$info = json_decode($userInfo,true);
		$this->userDataM->setValByKey($id,'nickName',$info['nickName']);
		$this->userDataM->setValByKey($id,'avatarUrl',$info['avatarUrl']);
		return '1';
	}

	public function freeEnergy($id, $addEnergy)
	{
		$energy = $this->userDataM->getValByKey($id, 'energy');
		$energy += (int)$addEnergy;
		$this->userDataM->setValByKey($id, 'energy', $energy);
		return '1';
	}
}