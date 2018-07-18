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
*/

class UserData extends Model
{

	private $defaultUserData = [
		'energy'=>'50',
		'maxEnergy'=>'50',
		'coin'=>'0',
		'level'=>'1',
		'fishIndex'=>'1'
	];

	public function testModel()//$key, $value)
	{
		// $result = $this->redis->set($key,$value);
		$result = $this->redis->ping();
		return $result;
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

	private function setDefaultUserInfo($id)
	{
		foreach ($this->defaultUserData as $key => $value) {
			if(!($this->redis->hExists($id,$key)))
			{
				$this->redis->hset($id,$key,$value);
			}
		}
	}

	public function setValByKey($id, $key, $val)
	{
		return $this->redis->hset($id, $key, $val);
	}

	public function getValByKey($id, $key)
	{
		return $this->redis->hget($id, $key);
	}
}