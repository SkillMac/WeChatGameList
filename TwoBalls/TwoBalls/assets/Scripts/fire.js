
cc.Class({
    extends: cc.Component,

    properties: {
        time: {
            default: 0.5,
            tooltip: "动画的时间",
        },
        // audioBroke: {
        //     default: null,
        //     url: cc.AudioClip,
        // },
    },

    onLoad() {
        this.initData();
        this.initEffectFire();
    },
    initData() {
        this.audio = this.node.getComponent(cc.AudioSource);
    },
    initEffectFire() {
        let effectNode = this.node;
        effectNode.active = false;
        effectNode.opacity = 0;
        effectNode.setScale(0);
    },

    playFireEffect(callFunc,pos,scaleVal) {
        let self = this;
        let effectNode = this.node;
        effectNode.setPosition(pos);
        effectNode.active = true;
        scaleVal *=0.7;
        let showAction = cc.spawn(cc.scaleTo(this.time,scaleVal,scaleVal),cc.fadeIn(this.time));
        effectNode.runAction(showAction);
        // cc.audioEngine.play(this.audioBroke,false,1);
        this.audio.play();
        effectNode.runAction(cc.sequence(cc.delayTime(this.time),cc.callFunc(()=>{
            self.reset();
            if (callFunc) {
                callFunc();
            }
        })))
    },

    reset() {
        this.initEffectFire();
    },
});
