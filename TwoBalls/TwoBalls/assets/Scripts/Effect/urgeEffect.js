let GameTools = require('GameTools');

cc.Class({
    extends: cc.Component,

    properties: {

    },

    init ( level ) {
        // 停掉
        if (level >cc.TB.GAME.hitPicCounts) {
            level = cc.TB.GAME.hitPicCounts
        }
        let sprite = this.node.getComponent(cc.Sprite)
        // let urgeCache = cc.resCache.getUrgeCache()
        let curPic = cc.js.formatStr('%d',level)
        if((!sprite.spriteFrame) || sprite.spriteFrame && sprite.spriteFrame.isValid)
            this.loadUrge(curPic,sp=>{
                sprite.spriteFrame = sp
            })
            // sprite.spriteFrame = urgeCache.getSpriteFrame(curPic)

        this.node.runAction(cc.sequence(cc.scaleTo(0.5,1.3),cc.fadeOut(0.5),cc.hide(),cc.callFunc(()=>{
            GameTools.destroy(this.node);
        })));
    },

    loadUrge(key,callFunc) {
        if(!CC_WECHATGAME) return
        // 此方法暂时适用于 微信小游戏
        let address = 'https://vdgames.vdongchina.com/TB/urge/'+ key + '.png'
        let sp = cc.resCache.getUrge(key)
        if(!sp) {
            cc.loader.load(address,(err,tex)=>{
                if(err) return
                sp = new cc.SpriteFrame(tex)
                cc.resCache.pushUrge(key,sp)
                callFunc(sp)
            })
        } else {
            callFunc(sp)
        }
    },

    show1() {
        this.node.runAction(cc.repeatForever(cc.sequence(cc.rotateTo(0.3,-30),cc.rotateTo(0.6,30),cc.rotateTo(0.3,0),cc.delayTime(2))))
    }
});
