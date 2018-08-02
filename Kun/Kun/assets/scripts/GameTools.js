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
        let result = parseInt(value);
        // let h = Math.floor(result / 3600) < 10 ? '0'+Math.floor(result / 3600) : Math.floor(result / 3600);
        let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 % 60));
        let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
        return '' + m + ":" + s;
    },

    loadDragonBones(node_,path,armatureName='Armature',animationName,timeScale,playTimes,completeCallback){
        cc.loader.loadResDir('dragonBones/' + path, (err,assets)=>{
            if(err || assets) return
            let armatureDisplay = node_.getComponent(dragonBones.ArmatureDisplay)
            if(!armatureDisplay) {
                armatureDisplay = node_.addComponent(dragonBones.ArmatureDisplay)
            }
            assets.forEach(asset => {
                if(asset instanceof dragonBones.DragonBonesAsset){
                    armatureDisplay.dragonAsset = asset
                }
                if(asset instanceof dragonBones.DragonBonesAtlasAsset){
                    armatureDisplay.dragonAtlasAsset  = asset
                }
            })
            armatureDisplay.armatureName = armatureName
            armatureDisplay.timeScale = timeScale
            armatureDisplay.playAnimation(animationName,playTimes)
            armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE,completeCallback)
        })
    },

    playAudio(file,isLoop=false,volume=1) {
        cc.audioEngine.play(cc.url.raw('resources/audio/') + file + '.mp3',isLoop, volume)
    },

    checkIsOldShareTicket(ticket) {
        if(T.giftShareTicketsList.indexOf(ticket) > -1) {
            return true
        }
        T.giftShareTicketsList.push(ticket)
        return false
    },

    sendMessage(data) {
        if(CC_WECHATGAME) {
            let content = wx.getOpenDataContext()
            content.postMessage(data)
        }
    },

    random(num1,num2) {
        num1 = parseInt(num1)
        num2 = parseInt(num2)
        return parseInt(cc.random0To1() * (num2 - num1) + num1)
    },

    // exchange(num1,num2) {
    //     num1 = [num2,num2=num1][0]
    //     return [num1,num2]
    // }
}

export default T;