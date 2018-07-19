
cc.Class({
    extends: cc.Component,

    properties: {
        
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

        window.KUN.WeChat = new WeChat()
        KUN.WeChat.login(()=>{
            KUN.Server.init(()=>{
                this._isCanClickFlag = true
            })
        })
    },

    startUp() {
        if(!this._isCanClickFlag) return
        cc.director.loadScene('MainGame')
        KUN.GameStatus.status = KUN.GameStatus.statusList[2]
    },
});
