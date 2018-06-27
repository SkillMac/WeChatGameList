
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
       this.speed = 0
       if(cc.TB.GAME.giftSkinIndex != '-1') {
            this.speed = cc.TB.GAME.giftSkinCfg[cc.TB.GAME.giftSkinIndex][1]
       } else {
            this.speed = cc.TB.GAME.defaultPlayerSpeed
       } 
    },

    registerClickEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.changeSpeed, this);
    },

    changeSpeed(event) {
        if(cc.TB.GAME.isPlaying){
            this.playerCom.setSpeedY(this.speed);
        }
    },
});
