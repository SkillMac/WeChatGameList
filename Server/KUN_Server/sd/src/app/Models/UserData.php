<?php

namespace app\Models;

use Server\CoreBase\Model;

/*
* openid
* session_key
* energy
* maxEnergy
* coin
* level
* fishIndex
* coast_coin
* coast_energy
*
* login_time
*
* start_flock_energy_time
*
* flee_counts
* 
* //
* priceList
* 
*/

class UserData extends Model
{

	private $defaultUserData = [
		'energy'=>'50',
		'maxEnergy'=>'50',
		'coin'=>'0',
		'level'=>'1',
		'fishIndex'=>'1',
		'zoom'=>'3',
		'zoom_dt'=>'0.125'
	];

	private function setDefaultUserInfo($id)
	{
		foreach ($this->defaultUserData as $key => $value) {
			if(!($this->redis->hExists($id,$key)))
			{
				$this->redis->hset($id,$key,$value);
			}
		}
	}

	public function saveUserOpenid($userInfo)
	{
		$openid = $userInfo->openid;
		$session_key = $userInfo->session_key;
		$id = md5($openid);
		$flag = 1;

		if(!$this->redis->exists($id))
		{
			$flag = $this->redis->hset($id,'openid',$openid);
		}

		$flag = $this->redis->hset($id,'session_key',$session_key);
		$flag = $this->redis->hset($id,'login_time',(string)$userInfo->login_time);

		// if(!$flag) {
		// 	$id = -1;
		// }
		$this->setDefaultUserInfo($id);
		return $id;
	}

	public function getUserInfoById($id, $isAll=false)
	{
		$result = $this->redis->hGetAll($id);
		if(!$isAll)
		{
			unset($result['openid']);
			unset($result['session_key']);
		}
		return $result;
	}

	public function setValByKey($id, $key, $val)
	{
		return $this->redis->hset($id, $key, $val);
	}

	public function getValByKey($id, $key)
	{
		return $this->redis->hget($id, $key);
	}

	public function incrValByKey($id, $key, $increment)
	{
		return $this->redis->hIncrBy($id, $key, $increment);
	}

	public function set($key, $val)
	{
		return $this->redis->set($key, $val);
	}

	public function get($key)
	{
		return $this->redis->get($key);
	}
}