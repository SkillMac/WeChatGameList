
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad() {
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
    },

    startUp() {
        cc.director.loadScene('MainGame')
    },
});
