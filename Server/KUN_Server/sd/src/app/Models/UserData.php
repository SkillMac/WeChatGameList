<?php

namespace app\Models;

use Server\CoreBase\Model;

class UserData extends Model
{
	public function testModel()//$key, $value)
	{
		// $result = $this->redis->set($key,$value);
		$result = $this->redis->ping();
		return $result;
	}
}