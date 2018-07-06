

cc.Class({
    extends: cc.Component,

    properties: {

    },

    init ( level ) {
        if (level >cc.TB.GAME.hitPicCounts) {
            level = cc.TB.GAME.hitPicCounts
        }
        let sprite = this.node.getComponent(cc.Sprite)
        let urgeCache = cc.resCache.getUrgeCache()
        let curPic = cc.js.formatStr('%d',level)
        sprite.spriteFrame = urgeCache.getSpriteFrame(curPic)
        this.node.runAction(cc.sequence(cc.scaleTo(0.5,1.3),cc.fadeOut(0.5),cc.hide(),cc.callFunc(()=>{
            this.node.destroy()
        })));
    },

    show1() {
        this.node.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(0.3,-30),cc.rotateTo(0.6,30),cc.rotateTo(0.3,0),cc.delayTime(2))))
    }
});
