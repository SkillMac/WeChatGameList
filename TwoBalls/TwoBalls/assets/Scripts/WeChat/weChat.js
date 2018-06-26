
let GameTools = require('GameTools');
let shareParams = {
    type: {
        share: 0, // 单纯的分享
        groupShare: 1, // 查看群排行
        dare: 2,    // 发起挑战
        needRelife: 3, // 寻求好友复活
        gift: 4, //赠送
    }
}
let T = cc.Class({

    ctor() {
        if(CC_WECHATGAME){
            // 开启shareTicket
            this.openShareTicketSetting();
            // 绑定启动监听函数
            this.bandingOnShowFunc();
            // 打开被动转发 并监听
            this.openShareSetting();
        }
        
    },

    statics: {
        registerOnGroupShareFunc(func) {
            if(CC_WECHATGAME) {
                T._onGroupShareFunc = func;
            }
            
        },

        openWeChatShare(title_, query_, imageUrl_, successFunc, failFunc) {
            if(CC_WECHATGAME) {
                wx.shareAppMessage({
                    title: title_,
                    query: query_,
                    imageUrl: imageUrl_,
                    success: (res) => {
                        if(successFunc) {
                            successFunc(res)
                        }
                    },
                    fail: res => {
                        if(failFunc) {
                            failFunc(res)
                        }
                    }
                })
            }
        }
    },

    checkIsLogin(func) {
        if(!this.checkIsWeChat()) {return;}
        this.callfunc = func;
        let self = this;
        wx.checkSession({
            success: function() {
                self.login();
                //self.getUserInfo();
            },
            fail: function() {
                self.login();
            }
        });
    },

    login() {
        if(!this.checkIsWeChat()) {return;}
        let weChatData = cc.TB.GAME.weChatData;
        let self = this;
        wx.login({
            success: function(res) {
                // weChatData.code = res.code;
                // let curUrl = "https://api.weixin.qq.com/sns/jscode2session";
                // wx.request({
                //     url: curUrl,
                //     data: {
                //         appid: weChatData.appId,
                //         secret: weChatData.appSecret,
                //         grant_type: 'authorization_code',
                //         js_code: res.code,
                //     },
                //     header: {
                //         'content-type': 'application/json' 
                //     },
                //     success: function(res) {
                //         console.log(res.data)
                //         if (res.data.openid != null & res.data.openid != undefined) {
                //             weChatData.openid = res.data.openid;
                //             weChatData.session_key = res.data.session_key;
                //         }
                //         self.getUserInfo();
                //     }
                // });
                self.getUserInfo();
            }
        });
    },

    getUserInfo() {
        if(!this.checkIsWeChat()) {return;}
        let weChatData = cc.TB.GAME.weChatData;
        let self = this;
        wx.getUserInfo({
            success: function(res) {
                let userInfo = res.userInfo;
                weChatData.userInfo = userInfo;
                // avatarUrl
                // nickName
                // gender //性别 0：未知、1：男、2：女
                // province 省
                // city
                // country
                if (self.callfunc) {
                    self.callfunc();
                }
            }
        });
    },

    checkIsWeChat() {
        // CC_WECHATGAME 这个宏 也可以判断是否在 微信小游戏的环境
        return cc.TB.GAME.checkIsWeChat();
    },

    loadImagByUrl(imageUrl, node) {
        if(!this.checkIsWeChat()) {return;}
        cc.loader.load({url: imageUrl, type: 'jpg'}, function(err, texture){
            node.spriteFrame = new cc.SpriteFrame(texture);
        });
    },

    uploadScore(score_){
        if(!this.checkIsWeChat()) {return;}
        // let data = new Array();
        // let dataFormat = {
        //     "wxgame": {
        //         "score": score_,
        //         "update_time": new Date().getTime()
        //     },
        //     //value: score_,
        // }
        // data.push({
        //     key: "xwxdata",
        //     value: JSON.stringify(dataFormat),
        // });
        GameTools.sendMessage({
            type: GameTools.msgType.submitScore,
            scoreData: {
                key: cc.TB.GAME.weChatData.keyList[0],
                score: score_,
            },
        });
        // wx.setUserCloudStorage({
        //     KVDataList: data,
        //     success: function (res) {
        //         console.log('setUserCloudStorage', 'success', res)
        //     },
        //     fail: function (res) {
        //         console.log('setUserCloudStorage', 'fail')
        //     },
        //     complete: function (res) {
        //         console.log('setUserCloudStorage', 'ok')
        //     }
        // });
    },

    // 群分享
    groupShare(type, callback_, callback2_) {
        if(CC_WECHATGAME) {
            let address = 'https://vdgames.vdongchina.com/TB/1.0/share/'
            let title = ''
            let params = ''
            let url = ''
            if(type === 'share'){

                title = '发射吧,我的小泡珠!'
                params = 'type=' + shareParams.type.share
                url = address + 'share.jpg'
            } else if(type === 'groupShare') {

                title = '看一看,我的群排行'
                params = 'type=' + shareParams.type.groupShare
                url = address + 'share4.jpg'
            } else if (type === 'dare') {

                title = '你能超越我吗?'
                params = 'type=' + shareParams.type.dare + '&score=' + cc.TB.GAME.score
                url = address + 'share2.jpg'
            } else if (type === 'gift') {

                title = '收下我的礼物!'
                params = 'type=' + shareParams.type.gift
                url = address + 'share3.jpg'
            } else if (type === 'relife') {
                
                title = '帮帮我,我要复活!'
                params = 'type=' + shareParams.type.needRelife
                url = address + 'share5.jpg'
            }
            T.openWeChatShare(title,params,url, res=>{
                if(callback_) {
                    callback_()
                }
            }, res=>{
                if(callback2_) {
                    callback2_()
                }
            })
        }
    },

    openShareTicketSetting() {
        wx.updateShareMenu({withShareTicket: true});
    },

    bandingOnShowFunc() {
        // 启动
        let option = wx.getLaunchOptionsSync();
        console.log('小游戏启动',option);
        if(option.query.type == shareParams.type.groupShare && option.shareTicket != undefined) {
            // 群排行
            cc.TB.GAME.weChatData.shareTicket = option.shareTicket;
            this.onGroupShareFunc();
        }
        
        // 显示
        wx.onShow((res)=>{
            // shareTicket
            console.log('切换到前台',res);
            if(res.query.type == shareParams.type.groupShare && res.shareTicket){
                // 群排行
                cc.TB.GAME.weChatData.shareTicket = res.shareTicket;
                // 显示群排行
                this.onGroupShareFunc();
            }
        });
    },

    openShareSetting() {
        wx.showShareMenu({
            withShareTicket: true,
        });
        wx.onShareAppMessage(
            () => {
                let address = 'https://vdgames.vdongchina.com/TB/1.0/share/'
                return {
                    title: '一起玩',
                    imageUrl: address + 'share.jpg',
                }
            }
        );
    },

    showAD() {
        // 插屏广告接入
    },

    adjustBgScaleY(node) {
        if(CC_WECHATGAME){
            wx.getSystemInfo({
                success: (res) => {
                    let desginSize = cc.TB.GAME.getDesignSize();
                    let ratio = res.screenWidth / desginSize.width;
                    let curRatio = res.screenHeight / node.height * ratio * node.scaleY;
                    //console.log('屏幕适配',ratio,curRatio);
                    node.scaleY *= curRatio;
                },
            });
        }
    },

    onGroupShareFunc() {
        if(T._onGroupShareFunc) {
            T._onGroupShareFunc(cc.TB.GAME.weChatData.shareTicket);
        }
    },
});
