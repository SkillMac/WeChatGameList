
cc.Class({
    extends: cc.Component,

    properties: {
        
    },
    start () {
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
});
