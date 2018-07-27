
cc.Class({
    extends: cc.Component,

    properties: {
        tips: cc.Label
    },

    onLoad() {
        this._isCanClickFlag = false
        this.init()
        cc.director.preloadScene('MainGame')
        this.node.on(cc.Node.EventType.TOUCH_END,this.startUp,this)
    },

    init() {

        window.KUN = {}
        window.KUN.GameTools = require('GameTools')
        window.KUN.GameStatus = require('GameStatus')
        window.KUN.UserData = require('UserData')
        window.KUN.Server = require('Server')
        window.KUN.ResCache = require('ResCache')
        let WeChat = require('WeChat')

        WeChat.checkNewVersion()

        window.KUN.WeChat = new WeChat()

        this.login()

        if(cc.sys.platform == 0 || cc.sys.platform == 101) {
            KUN.Server.ONWINDOWS = true
            this._isCanClickFlag = true
        }
    },

    startUp() {
        if(!this._isCanClickFlag) return
        cc.director.loadScene('MainGame')
        KUN.GameStatus.status = KUN.GameStatus.statusList[2]
    },

    setTips(str_) {
        this.tips.string = str_
    },

    login() {
        this.setTips('服务器初始化')
        KUN.WeChat.login(()=>{
            KUN.Server.init(()=>{
                // this._isCanClickFlag = true
                this.setTips('')
                this.loadFishRes(KUN.Server.getUserInfo().level)
            })
        })
    },

    loadFishRes(index) {
        this.setTips('资源加载中...')
        cc.loader.loadRes('fish/yu'+index+'_o',(err,assets)=>{
            if(err) {
                this.setTips('资源加载失败')
                return
            }
            this.setTips('点击进入游戏')
            this.tips.node.runAction(cc.repeatForever(cc.sequence(cc.fadeOut(1),cc.fadeIn(1))))
            this.finish()
        })
    },

    finish() {
        this._isCanClickFlag = true
    },
});
