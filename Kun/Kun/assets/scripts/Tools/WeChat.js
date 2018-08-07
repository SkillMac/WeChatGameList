
let GameTools = require('GameTools');
let shareParams = {
    type: {
        shareEnergy:0,
    }
}
let T = cc.Class({

    ctor() {
        if(CC_WECHATGAME) {
            // 开启shareTicket
            this.openShareTicketSetting();
            // 绑定启动监听函数
            this.bandingOnShowFunc();
            // 打开被动转发 并监听
            this.openShareSetting();

            wx.getSystemInfo({
                success: res =>{
                    KUN.GameStatus.model = res.model
                }
            })
        }
    },

    statics: {
        baseUrl_ : 'https://vdgames.vdongchina.com:9092/',
        baseServerUrl : 'https://vdgames.vdongchina.com:9092/AppController/',
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

    login(func_) {
        if(!CC_WECHATGAME) return
        let self = this
        wx.login({
            success: function(res) {
                let curUrl = T.baseServerUrl + 'login'
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
                        console.log('唯一id',res.data)
                        self.getUserInfo(func_)
                    },
                    fail: (res) => {
                        // console.log('请求失败',res)
                    }
                });
            },
        });
    },

    getUserInfo(func_) {
        if(!this.checkIsWeChat()) {return;}
        wx.getUserInfo({
            withCredentials : false,
            success: (res) => {
                let userInfo = res.userInfo
                // avatarUrl
                // nickName
                // gender //性别 0：未知、1：男、2：女
                // province 省
                // city
                // country
                KUN.Server.uploadUserData(JSON.stringify(userInfo),res=>{
                    if(res == '1') {
                        func_()
                    } else {
                        // 暂时不做处理
                    }
                })
            },
            fail: (res)=>{
                // 未授权 处理
                wx.showModal({
                    title: '温馨提示',
                    content: '为了良好的体验,请开启用户信息授权,以便我们可以储存你的数据!',
                    success: res =>{
                        if(res.confirm || res.cancel) {
                            let button = wx.createOpenSettingButton({
                                type: 'text',
                                text: '打开设置页面',
                                style: {
                                    left: 10,
                                    top: 76,
                                    width: 170,
                                    height: 40,
                                    lineHeight: 40,
                                    backgroundColor: '#4b6881',
                                    color: '#ffffff',
                                    textAlign: 'center',
                                    fontSize: 16,
                                    borderRadius: 4
                                }
                            })
                            button.show()
                            button.onTap(() => {
                                wx.getSetting({
                                    success: res => {
                                        button.destroy()
                                        if(res.authSetting['scope.userInfo']) {
                                            wx.getUserInfo({
                                                withCredentials : false,
                                                success: res => {
                                                    let info = res.userInfo
                                                    KUN.Server.uploadUserData(JSON.stringify(info),res=>{
                                                        if(res == '1') {
                                                            func_()
                                                        } else {
                                                            // 暂时不做处理
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    }
                                })
                            })
                        }
                    }
                })
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
    groupShare(type, callback_, callback2_, cfg_) {
        if(CC_WECHATGAME) {
            let address = 'https://vdgames.vdongchina.com/TB/share/'
            let title = ''
            let params = ''
            let url = ''

            switch (type) {
                case 'FreeEnergy':
                    title = '鲲只能当零食!!!'
                    params = 'type=' + shareParams.type.shareEnergy
                    url = T.baseUrl_+'share/share1.jpg'
                    break;
            
                default:
                    break;
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
        console.log('启动信息',option)
        if(option.shareTicket) {
            if(option.query.type == shareParams.type.shareEnergy) {
                // 从微信群里面点击
                KUN.GameStatus.weChatData.shareTicket = option.shareTicket;
                if(!KUN.GameTools.checkIsOldShareTicket(option.shareTicket)) {
                    this.tellMainCtrl(KUN.GameStatus.weChatFuncType.freeEnergy)
                }
            } 
        }

        // 显示
        wx.onShow((res)=>{
            KUN.GameStatus.status = KUN.GameStatus.statusList[2]
            console.log('切回前台信息',res)
            // shareTicket
            if(res.query.type == shareParams.type.shareEnergy && res.shareTicket){
                // 群排行
                KUN.GameStatus.weChatData.shareTicket = res.shareTicket;
                if(!KUN.GameTools.checkIsOldShareTicket(res.shareTicket)) {
                    this.tellMainCtrl(KUN.GameStatus.weChatFuncType.freeEnergy)
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
                return {
                    title: '鲲时代来临',
                    imageUrl: T.baseUrl_ + 'share/share.jpg',
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

    showGiftTips(str_) {
        //提示 信息
    },

    tellMainCtrl(type_) {
        cc.director.getScene().getChildByName('Canvas').getComponent('MainCtrl').weChatFunc(type_)
    },
});
