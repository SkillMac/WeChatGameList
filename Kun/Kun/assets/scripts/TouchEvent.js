
cc.Class({
    extends: cc.Component,

    properties: {

    },
    
    init(mainCtrl) {
        this._mainCtrl = mainCtrl
        this.node.on(cc.Node.EventType.TOUCH_END,this.touchEvent,this)
    },

    touchEvent(e) {
        e.stopPropagation()
        // reflush new fish
        // tell main ctrl birth new fish
        if(this._mainCtrl.checkCanTouch()) {
            KUN.Server.rEnemyData(()=>{
                this._mainCtrl.touchEndEvent()
            })
        }
    }
});
