
cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            type: cc.Node,
            tooltip: "玩家节点",
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.initData();
        this.registerClickEvent();
    },

    start () {

    },

    initData() {
       this.playerCom = this.player.getComponent('player');
    },

    registerClickEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.changeSpeed, this);
    },

    changeSpeed(event) {
        if(cc.TB.GAME.isPlaying){
            this.playerCom.setSpeedY(this.playerCom.moveSpeedY);
        }
    },
});
