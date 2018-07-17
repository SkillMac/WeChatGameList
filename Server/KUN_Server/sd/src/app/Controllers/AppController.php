<?php

namespace app\Controllers;

use Server\CoreBase\Controller;

class AppController extends Controller
{
	// public $AppModel;
	protected $GetIPAddressHttpClient;

	public $result = array("urge_money"=>"1",
		"relife"=>"1",
		"autoGiftDialog"=>"1",
		"taskPanel"=>"1"
		);


	public function initialization($controller_name, $method_name)
    {
        parent::initialization($controller_name, $method_name);
        $this->GetIPAddressHttpClient = get_instance()->getAsynPool('HttpClientX');
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
    		
			$this->http_output->end($response['body']);
		}
	}
}
