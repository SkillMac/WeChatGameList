import BaseFish from "BaseFish";

cc.Class({
    extends: BaseFish,

    properties: {
        
    },

    init() {
        this.initData()
        this._super()
    },

    initData() {
        this._baseSize = this.node.scaleX
        this.sprite = this.getComponent(cc.Sprite)
    },

    getData() {
        return {
            size: this._baseSize,
            level: this.getLevel(),
        }
    },

    getLevel() {
        return KUN.UserData.getLevel()
    },

    openMouth() {
        KUN.ResCache.setSpriteFrame(this.sprite, cc.js.formatStr('fish/yu%d_o',this.getLevel()))
        this.node.runAction(cc.sequence(cc.delayTime(this._showTime),cc.callFunc(()=>{
            KUN.ResCache.setSpriteFrame(this.sprite, cc.js.formatStr('fish/yu%d',this.getLevel()))
        })))
    },
});
