
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onEventSwallow,this);
    },

    onEventSwallow(event) {
        console.log(cc.TB.GAME.panelBgDestroyFunc)
        if(cc.TB.GAME.panelBgDestroyFunc) {
            cc.TB.GAME.panelBgDestroyFunc()
            cc.TB.GAME.panelBgDestroyFunc = null
        }
        event.stopPropagation();
    }
});
