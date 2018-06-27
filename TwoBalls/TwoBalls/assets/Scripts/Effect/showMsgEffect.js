
cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    show () {
        this.endPos = cc.p(0,100);
        this.moveTime = 0.75;
        this.fadeTime = 0.75;
        this.startDelayTime = 0;
        setTimeout(() => {
            this.node.runAction(cc.spawn(cc.moveBy(this.moveTime,this.endPos),cc.fadeOut(this.fadeTime)));
        }, this.startDelayTime*1000);
        this.node.runAction(cc.sequence(cc.delayTime(this.startDelayTime+this.moveTime),cc.callFunc(()=>{
            this.node.destroy();
        })));
    },

    show2() {
        this.node.opacity = 0
        this.node.runAction(cc.sequence(cc.fadeIn(0.3),cc.delayTime(1),cc.fadeOut(0.3),cc.callFunc(()=>{
            this.node.destroy()
        })))
    }
});
