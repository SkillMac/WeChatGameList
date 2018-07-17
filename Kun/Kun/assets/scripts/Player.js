import BaseFish from "BaseFish";

cc.Class({
    extends: BaseFish,

    properties: {
        mouthPos: cc.Node,
        goldPfb: cc.Prefab,
    },

    init(ctrl) {
        this._super(ctrl)
        this.initData()
        this.changeFishSkin()
    },

    initData() {
        this._baseSize = this.node.scaleX
        this.sprite = this.getComponent(cc.Sprite)
    },

    getData() {
        return {
            size: this._baseSize,
            level: this.getLevel(),
            tarPos: this.calcMouthPos(),
        }
    },

    getLevel() {
        return KUN.UserData.getLevel()
    },

    getFishIndex() {
        return KUN.UserData.getFishIndex()
    },

    openMouth() {
        this._ctrl.startEat()
        KUN.ResCache.setSpriteFrame(this.sprite, cc.js.formatStr('fish/yu%d_o',this.getFishIndex()))
        this.node.runAction(cc.sequence(cc.delayTime(this._showTime),cc.callFunc(()=>{
            KUN.ResCache.setSpriteFrame(this.sprite, cc.js.formatStr('fish/yu%d',this.getFishIndex()))
            this._ctrl.finishEatBefore()
        })))
    },

    calcMouthPos() {
        return cc.director.getScene().convertToWorldSpaceAR(this.mouthPos.getPosition())
    },

    collectGold(pos) {
        let node_ = cc.instantiate(this.goldPfb)
        this._ctrl.node.addChild(node_)
        node_.setPosition(this.calcMouthPos())
        node_.runAction(
            cc.sequence(
            cc.moveTo(0.35,pos).easing(cc.easeExponentialIn()),
            cc.scaleTo(0.1,1.3),
            cc.scaleTo(0.1,1.0),
            cc.hide(),
            cc.callFunc(()=>{
                this._ctrl.finishEat()
                node_.destroy()
            }),
        ))
    },

    changeFishSkin() {
        KUN.ResCache.setSpriteFrame(this.sprite, cc.js.formatStr('fish/yu%d',this.getFishIndex()))
    },
});
