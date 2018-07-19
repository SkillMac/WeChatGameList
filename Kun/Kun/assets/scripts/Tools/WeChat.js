
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
        if(CC_WECHATGAME) {
            // 开启shareTicket
            // this.openShareTicketSetting();
            // 绑定启动监听函数
            // this.bandingOnShowFunc();
            // 打开被动转发 并监听
            // this.openShareSetting();

            // wx.getSystemInfo({
            //     success: res =>{
            //         cc.TB.GAME.model = res.model
            //     }
            // })
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
        },

        checkNewVersion() {
            if (CC_WECHATGAME && typeof wx.getUpdateManager === 'function') {
                const updateManager = wx.getUpdateManager()

                updateManager.onCheckForUpdate(function (res) {})

                updateManager.onUpdateReady(function ( res ) {
                    wx.showModal({
                        title: '更新提示',
                        content: '新版本来袭，是否重启应用？',
                        success: function (res) {
                          if (res.confirm) {
                            updateManager.applyUpdate()
                          }
                        }
                      })
                })

                updateManager.onUpdateFailed(function () {})
              }
        },
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
        if(!CC_WECHATGAME) return
        wx.login({
            success: function(res) {
                console.log('code is ',res.code)
                let curUrl = "https://vdgames.vdongchina.com:9092/AppController/login";
                wx.request({
                    url: curUrl,
                    data: {
                        code: res.code,
                    },
                    header: {
                        'content-type': 'application/json' 
                    },
                    success: function(res) {
                        // console.log('请求成功',res.data)
                        KUN.Server.id = res.data
                    },
                    fail: (res) => {
                        // console.log('请求失败',res)
                    }
                });
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
        return CC_WECHATGAME;
    },

    loadImagByUrl(imageUrl, node) {
        if(!this.checkIsWeChat()) {return;}
        cc.loader.load({url: imageUrl, type: 'jpg'}, function(err, texture){
            node.spriteFrame = new cc.SpriteFrame(texture);
        });
    },

    uploadScore(){
        if(!this.checkIsWeChat() || !cc.TB.GAME.isUploadDataFlag) {return;}
        GameTools.sendMessage({
            type: GameTools.msgType.submitScore,
            scoreData: {
                key: cc.TB.GAME.weChatData.keyList[0],
                score: cc.TB.GAME.maxScore,
                //cc.TB.GAME.maxHitCounts
                hitKey: cc.TB.GAME.weChatData.keyList[1],
                hitCounts: cc.TB.GAME.maxHitCounts,
            },
        });
    },

    // 群分享
    groupShare(type, callback_, callback2_, cfg) {
        if(CC_WECHATGAME) {
            let address = 'https://vdgames.vdongchina.com/TB/share/'
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
                params = 'type=' + shareParams.type.gift + "&index=" + cfg.index + "&ticket=" + cfg.time
                url = address + 'share3.jpg'
            } else if (type === 'relife') {
                
                title = '帮帮我,我要复活!'
                params = 'type=' + shareParams.type.needRelife
                url = address + 'share5.jpg'
            } else if (type === 'hit') {

                title = '我已连中靶心'+ cfg.hitCounts + '次,你行吗?',
                params = 'type='+ shareParams.type.share,
                url = 'https://vdgames.vdongchina.com/TB/hitPic/'+ cfg.hitCounts + '.jpg'
            }
            T.openWeChatShare(title,params,url, res=>{
                if(callback_) {
                    callback_(res)
                }
            }, res=>{
                if(callback2_) {
                    callback2_(res)
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
        if(option.query.type == shareParams.type.groupShare && option.shareTicket != undefined) {
            // 群排行
            cc.TB.GAME.weChatData.shareTicket = option.shareTicket;
            this.onGroupShareFunc();
        } 
        else if(option.query.type == shareParams.type.gift && option.shareTicket) {
            if(!cc.TB.GAME.checkIsOldShareTicket(option.query.time)) {
                this.showGiftTips('已领取礼物快来,开始游戏吧!')
                cc.TB.GAME.giftSkinIndex = option.query.index
            } else {
                this.showGiftTips('礼物已使用')
            }
        }

        if(option && GameTools.isShowPanelByServer('urge_money')) {
            cc.director.getScene().getChildByName('Canvas').getChildByName('menuStart').getComponent('StartUICtrl').urgeBtnEvent()
        }
        
        // 显示
        wx.onShow((res)=>{
            // shareTicket
            if(res.query.type == shareParams.type.groupShare && res.shareTicket){
                // 群排行
                cc.TB.GAME.weChatData.shareTicket = res.shareTicket;
                // 显示群排行
                cc.director.loadScene('StartScene',()=>{
                    cc.director.getScene().getChildByName('Canvas').getChildByName('menuStart').getComponent('StartUICtrl').onGroupShare(res.shareTicket)
                })
            }
            else if (res.query.type == shareParams.type.gift && res.shareTicket) {
                if(!cc.TB.GAME.checkIsOldShareTicket(res.query.time)) {
                    cc.TB.GAME.giftSkinIndex = res.query.index
                    this.showGiftTips('已领取礼物快来,开始游戏吧!')
                } else {
                    this.showGiftTips('礼物已使用')
                }
            }
        });
    },

    openShareSetting() {
        wx.showShareMenu({
            withShareTicket: true,
        });
        wx.onShareAppMessage(
            () => {
                let address = 'https://vdgames.vdongchina.com/TB/share/'
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

    showGiftTips(str_) {
        cc.loader.loadRes('prefab/Tips1', cc.Prefab, (err, prefab)=>{
            let node = cc.instantiate(prefab)
            node.getComponent('showMsgEffect').show2()
            node.getChildByName('tips').getComponent(cc.Label).string = str_
            cc.director.getScene().getChildByName('Canvas').addChild(node)
        })
    },
});
