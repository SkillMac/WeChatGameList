let GameTools = require('GameTools');

cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad() {
        this.initData();
    },

    initData() {
        this.node.opacity = 0
        this.fadeTime = 0.35
        this.sprite = this.node.getComponent(cc.Sprite)
        this.node.rotation = cc.random0To1()*360
    },

    playFireEffect(scaleVal, skinIndex) {
        this.changeSkin(skinIndex)
        scaleVal *=0.5;
        this.node.setScale(scaleVal)
        cc.audioEngine.play(cc.url.raw('resources/audio/broke1.mp3'))
        this.node.runAction(cc.sequence(cc.fadeIn(this.fadeTime),cc.delayTime(2),cc.fadeOut(0.7),cc.callFunc(()=>{
            GameTools.destroy(this.node);
        })))
        return this.fadeTime + 0.35
    },

    changeSkin(skinIndex) {
        if(this.sprite.spriteFrame && this.sprite.spriteFrame.isValid)
            this.sprite.spriteFrame = cc.resCache.getBombEffectCache().getSpriteFrame(''+skinIndex)
    },
});
