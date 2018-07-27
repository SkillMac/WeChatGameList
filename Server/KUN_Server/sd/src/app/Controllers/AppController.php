<?php

namespace app\Controllers;

use Server\CoreBase\Controller;

class AppController extends Controller
{
	// public $AppModel;
	protected $GetIPAddressHttpClient;
	private $logicM = null;

	public $result = array("urge_money"=>"1",
		"relife"=>"1",
		"autoGiftDialog"=>"1",
		"taskPanel"=>"1"
		);


	public function initialization($controller_name, $method_name)
    {
        parent::initialization($controller_name, $method_name);
        $this->GetIPAddressHttpClient = get_instance()->getAsynPool('HttpClientX');
        $this->logicM = $this->loader->model('Logic',$this);
    }


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

	public function http_setVal()
	{
		$id = $this->http_input->get('id');
		$name = $this->http_input->get('key');
		$val = $this->http_input->get('val');

		$model = $this->loader->model('UserData', $this);
		$model->setValByKey($id,$name,$val);
		$this->http_output->end('1');
	}

	public function http_getVal()
	{
		$id = $this->http_input->get('id');
		$name = $this->http_input->get('key');
		$model = $this->loader->model('UserData', $this);
		$res = $model->getValByKey($id, $name);
		$this->http_output->end($res);
	}

	public function http_testModel()
	{
		// $type = $this->http_input->get('type');
		$model = $this->loader->model('UserData', $this);
		
		// if($type == 1)
		// {

		// } elseif ($type == 2)
		// {

		// }
		
		$this->http_output->end($model->testModel());
	}

	public function http_testHttpClient()
	{
		$response = $this->GetIPAddressHttpClient->httpClient
        	->setQuery(['type'=>1,'version'=>'1.0.2'])
        	->coroutineExecute('/AppController/echo');
        $this->http_output->end($response['body']);
	}

	public function http_login()
	{
		$code = $this->http_input->get('code');
		if(empty($code) || $code == '')
		{
			$this->http_output->end('-1');
		} else {
			$response = $this->GetIPAddressHttpClient->httpClient->setQuery([
				'appid'=>'wxdfc7eb71a7ad9df6',
        		'secret'=>'4512c39c66615628c91cc49b896d4612',
        		'js_code'=>$code,
        		'grant_type'=>'authorization_code'
    		])->coroutineExecute('/sns/jscode2session');

    		$userInfo = json_decode($response['body']);
    		$userInfo->login_time = time();

    		if (array_key_exists('errcode', $userInfo))
    		{
    			// 登录失败
    			$this->http_output->end('-1'); //$usrinfo['errmsg'])
    			$this->interrupt();
    		}

    		$model = $this->loader->model('UserData', $this);
    		$result = $model->saveUserOpenid($userInfo);
			$this->http_output->end(json_encode($result,true));
		}
	}

	public function http_getUserDataById()
	{
		$id = $this->http_input->get('id');
		$this->http_output->end($this->logicM->getUserInfo($id));
	}

	/////// logic //////////
	public function http_buildNewFish()
	{
		$id = $this->http_input->get('id');
		$res = $this->logicM->buildNewFish($id);
		$this->http_output->end($res);
	}

	public function http_finishEat()
	{
		$id = $this->http_input->get('id');
		$flag = $this->logicM->finishEat($id);
		$this->http_output->end($flag);
	}

	public function http_flee()
	{
		$id = $this->http_input->get('id');
		$flag = $this->logicM->flee($id);
		$this->http_output->end($flag);
	}

	public function http_flockEnergy()
	{
		$id = $this->http_input->get('id');
		$time = $this->logicM->flockEnergy($id);
		$this->http_output->end($time);
	}

	public function http_upgrade()
	{
		$id = $this->http_input->get('id');
		$res = $this->logicM->upgrade($id);
		$this->http_output->end($res);
	}

	public function http_saveUserInfo()
	{
		$id = $this->http_input->get('id');
		$userInfo = $this->http_input->get('userInfo');
		$res = $this->logicM->saveUserInfo($id,$userInfo);
		$this->http_output->end($res);
	}
}
