<?php

namespace app\Controllers;

use Server\CoreBase\Controller;

class AppController extends Controller
{
	// public $AppModel;

	public $result = array("urge_money"=>"1",
		"relife"=>"1",
		"autoGiftDialog"=>"1",
		"taskPanel"=>"1"
		);

	public function http_test()
	{
		$this->http_output->end(123);
	}

	public function http_echo()
	{
		$type = $this->http_input->get('type');
		if(empty($type))
		{
			$type = '-1';
		}
		$version = $this->http_input->get('version');
		if(empty($version))
		{
			$version = '1.0.2';
		}

		if($type == 1 && $version == '1.0.2')
		{
			// haha
			$this->http_output->end(json_encode($this->result));
		}
	}
}
