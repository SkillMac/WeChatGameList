
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onEventSwallow,this);
    },

    onEventSwallow(event) {
        event.stopPropagation();
    }
});
