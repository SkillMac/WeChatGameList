<?php

namespace app\Controllers;

use Server\CoreBase\Controller;

class AppController extends Controller
{
	// public $AppModel;
	protected $GetIPAddressHttpClient;
	private $logicM = null;

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

	public function http_login()
	{
		$code = $this->http_input->get('code');
		if(empty($code) || $code == '')
		{
			$this->http_output->end('-1');
		} else {
			$response = $this->GetIPAddressHttpClient->httpClient->setQuery([
				'appid'=>'wx90f162aa048355d4',
        		'secret'=>'cb107cfecbadd9affe32a0eb8df1b653',
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
		$last_result = $this->http_input->get('last_result');
		$res = $this->logicM->buildNewFish($id,$last_result);
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

	public function http_freeEnergy()
	{
		$id = $this->http_input->get('id');
		$addEnergy = $this->http_input->get('addEnergy');
		$res = $this->logicM->freeEnergy($id,$addEnergy);
		$this->http_output->end($res);
	}
}
