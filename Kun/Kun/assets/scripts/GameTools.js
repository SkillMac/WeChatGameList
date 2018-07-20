let T = {
    httpGet(url_, reqData, callback, fail_) {
        if(CC_WECHATGAME) {
            // console.log('客户端数据',reqData);
            wx.request({
                url: KUN.GameStatus.address + url_,
                data: reqData,
                header: {
                    'content-type': 'application/json' 
                },
                success: function(res) {
                    // console.log('请求成功',res.data)
                    if(callback) {
                        callback(res.data)
                    }
                },
                fail: (res) => {
                    // console.log('请求失败',res)
                    if(fail_) {
                        fail_(res)
                    }
                }
            });
        } else {
            url_ += '?';
            for (let item in reqData) {
                url_ += item + '=' + reqData[item] + "&"
            }
            //console.log('请求的连接', GameTools.address + url_)
            const xhr = cc.loader.getXMLHttpRequest()
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    // console.log('raw data',xhr.responseText);
                    var response = xhr.responseText;
                    if(response) {
                        if(callback) {
                            callback(response)
                        }
                    } else {
                        // todo
                        if(fail_){
                            fail_()
                        }
                    }
                    //console.log('响应结果',response);
                } else {
                    //console.log('请求失败')
                }
            };
            // console.log(xhr)
            xhr.withCredentials = true;
            xhr.open("GET", KUN.GameStatus.address + url_, true);
            xhr.send();
        }
    },

    httpPost() {
        //todo
    },

    formatSeconds(value) {
        var secondTime = parseInt(value);// 秒
        var minuteTime = 0;// 分
        var hourTime = 0;// 小时
        if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
            //获取分钟，除以60取整数，得到整数分钟
            minuteTime = parseInt(secondTime / 60);
            //获取秒数，秒数取佘，得到整数秒数
            secondTime = parseInt(secondTime % 60);
            //如果分钟大于60，将分钟转换成小时
            if(minuteTime > 60) {
                //获取小时，获取分钟除以60，得到整数小时
                hourTime = parseInt(minuteTime / 60);
                //获取小时后取佘的分，获取分钟除以60取佘的分
                minuteTime = parseInt(minuteTime % 60);
            }
        }
        var result = "" + parseInt(secondTime) // + "秒";

        if(minuteTime > 0) {
            result = "" + parseInt(minuteTime) + ":" + result;
        }
        if(hourTime > 0) {
            result = "" + parseInt(hourTime) + ":" + result;
        }
        return result;
    }
}

export default T;