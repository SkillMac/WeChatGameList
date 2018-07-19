<?php

namespace app\Models;

use Server\CoreBase\Model;

class Logic extends Model
{

	private $userDataM = null;
	private $level = 1;
	private $addEnergy = 6;

	private $probCfg = [
		[
			'flag'=>'eaten',
			'prob'=>5,
			'range'=> [1,4],
			'coastPre'=>0.02,
		],
		[
			'flag'=>'passBy',
			'prob'=> 70,
			'range'=>['1',4],
			'coastPre'=>0.01,
		],
		[
			'flag'=>'eat',
			'prob'=> 20,
			'range'=>[-4,-1],
			'coastPre'=>0.02,
		],
		[
			'flag'=>'meet',
			'prob'=> 5,
			'range'=>['1',4],
			'coastPre'=>0.05,
		],
	];

	public function initialization(&$context)
	{
	    parent::initialization($context);
	   	$this->userDataM = $this->loader->model('UserData',$this);
	}

	private function get_fish_show_way()
    {
    	$arr = [5,90,0,5];
    	if($this->level > 1)
    	{
    		foreach ($this->probCfg as $key => $value) {
	    		$arr[$key] = $value[prob];
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

    private function rand_level($cfg)
    {
    	$min = is_string($cfg['range'][0]) ? (int)($cfg['range'][0]) : $this->level + $cfg['range'][0];
    	$max = is_string($cfg['range'][1]) ? (int)($cfg['range'][1]) : $this->level + $cfg['range'][1];
    	return mt_rand($min,$max);
    }
	
	private function buildFishData($id)
	{
		$tmp_array = [];
		$curConfig = $this->get_fish_show_way();
		$tmp_array['flag'] = $curConfig['flag'];
		// build level
		$level = $this->rand_level($curConfig);
		$tmp_array['level'] = $level;
		$tmp_array['fish_index'] = $level;
		$tmp_array['coast_coin'] = $this->getFishListPrice()[$level] * $curConfig['coastPre'];
		if($tmp_array['flag'] == 'eaten') {
			$tmp_array['coast_coin'] = - $tmp_array['coast_coin'];
		}
		// deal user data
		$this->userDataM->setValByKey($id,'coast_coin',(string)($tmp_array['coast_coin']));
		$this->userDataM->setValByKey($id,'coast_energy',(string)-1);

		$tmp_array['user'] = $this->getUserInfo($id,true);
		return $tmp_array;
	}

	public function buildNewFish($id)
	{
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
				$priceList[$i] = (pow($i, 2) - $i + 2) * 500;
			}
			$this->userDataM->set('priceList',json_encode($priceList,true));
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
			return json_encode($result,true);
		} 
		else {
			return $result;
		}
		
	}

	public function finishEat($id)
	{
		$coast_coin = (int)($this->userDataM->getValByKey($id,'coast_coin'));
		$coin = (int)($this->userDataM->getValByKey($id,'coin'));
		$energy = (int)($this->userDataM->getValByKey($id,'energy'));
		$coast_energy = (int)($this->userDataM->getValByKey($id,'coast_energy'));
		if($coin + $coast_coin < 0)
		{
			$coast_coin = -$coin;
		}
		if($energy + $coast_energy < 0)
		{
			$coast_energy = -$energy;
		}
		$this->userDataM->incrValByKey($id,'coin',$coast_coin);
		$this->userDataM->incrValByKey($id,'energy',$coast_energy);
		return json_encode($this->getUserInfo($id,true));
	}

	public function flee($id)
	{
		$energy = (int)($this->userDataM->getValByKey($id,'energy'));
		$coast = -1;
		if($energy + $coast < 0)
		{
			$coast_energy = -$energy;
		}
		$this->userDataM->incrValByKey($id,'energy',-1);
		return json_encode($this->getUserInfo($id,true));
	}

	public function flockEnergy($id)
	{
		$energy = (int)($this->userDataM->getValByKey($id,'energy'));
		$maxEnergy = (int)($this->userDataM->getValByKey($id,'maxEnergy'));
		if($energy >= $maxEnergy)
		{
			return '-1';
		}

		$res = $this->userDataM->getValByKey($id,'start_flock_energy_time');

		if($res)
		{
			$res = (int)$res;
			$mul = (int)(time()+300 - $res) / 3600;
			if($mul > 1)
			{
				$val = $energy + ($mul * $this->addEnergy);
				$val = $val > $maxEnergy ? $maxEnergy - $energy : $val;
				$this->userDataM->incrValByKey($id,'energy',$val);
				if($val > $maxEnergy) {
					
					return json_encode($this->getUserInfo($id,true));
				}
				
				return $this->flockEnergy($id);
			}
			return '-1';
		}

		$start_time = time();
		$this->userDataM->setValByKey($id,'start_flock_energy_time',(string)$start_time);
		return json_encode($start_time);
	}
}