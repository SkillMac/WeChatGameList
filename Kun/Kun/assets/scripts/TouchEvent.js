
cc.Class({
    extends: cc.Component,

    properties: {

    },
    
    init(mainCtrl) {
        this._mainCtrl = mainCtrl
        this.node.on(cc.Node.EventType.TOUCH_END,this.touchEvent,this)
    },

    touchEvent(e) {
        // reflush new fish
        // tell main ctrl birth new fish
        this._mainCtrl.buildNewFish()
    }
});
