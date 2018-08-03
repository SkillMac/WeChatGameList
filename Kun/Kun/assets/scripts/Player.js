import BaseFish from "BaseFish";

cc.Class({
    extends: BaseFish,

    properties: {
        mouthPos: cc.Node,
        goldPfb: cc.Prefab,
    },

    init(ctrl) {
        this._super(ctrl,['run'])
        this.initData()
        this.node.removeComponent('Enemy')
    },

    initData() {
        this._baseSize = this.node.scaleX
        this.sprite = this.getComponent(cc.Sprite)
        this._coin = 0
        this._fishData = null
        this._enemyCtrl = null
    },

    setFishData(data) {
        this._fishData = data
    },

    getData() {
        return {
            size: this._baseSize,
            level: this.getLevel(),
            tarPos: this.calcMouthPos(),
            width: this.node.getContentSize()
        }
    },

    getLevel() {
        return KUN.UserData.getLevel()
    },

    getFishIndex() {
        return KUN.UserData.getFishIndex()
    },

    startEat() {
        //this.node.runAction(cc.sequence(cc.moveBy(0.1,cc.p(-100,0)),cc.moveBy(0.5,cc.p(100,0))))
        this.playNativeAnima('run',0,()=>{
            // to do
        })
    },

    openMouth() {
        let data = this._fishData
        this._coin = data.coin
        this._ctrl.startEat()
        if(!this._isUserDragonBones) {
            if(data.flag == 'eat') {
                KUN.ResCache.setSpriteFrame(this.sprite, cc.js.formatStr('fish/yu%d_o',this.getFishIndex()))
            }
            this.node.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(()=>{
                if(data.flag == 'eat') {
                    KUN.GameTools.playAudio('eatOrEaten')
                    KUN.ResCache.setSpriteFrame(this.sprite, cc.js.formatStr('fish/yu%d',this.getFishIndex()))
                    if(this._enemyCtrl) {
                        this._enemyCtrl.toDie()
                        this._enemyCtrl = null
                    }
                }
                if(data.flag != 'eaten') {
                    this._ctrl.finishEatBefore()
                } else {
                    // to do
                }
            })))
        } else {
            this.playAnima('tun',1,0.083,()=>{
                if(data.flag != 'eaten') {
                    this._ctrl.finishEatBefore()
                } else {
                    this.node.x = 1280
                    this.node.runAction(cc.sequence(cc.moveTo(this._showTime,cc.p(0,0)),cc.callFunc(()=>{
                        this._ctrl.finishEatBefore()
                    })))
                }
            })
        }
    },

    calcMouthPos() {
        return cc.director.getScene().convertToWorldSpaceAR(this.mouthPos.getPosition())
    },

    collectGold() {
        let node_ = cc.instantiate(this.goldPfb)
        this._ctrl.node.addChild(node_)
        node_.setPosition(0,0) //this.calcMouthPos())
        // node_.runAction(
        //     cc.sequence(
        //     cc.moveTo(0.35,pos).easing(cc.easeExponentialIn()),
        //     cc.scaleTo(0.1,1.3),
        //     cc.scaleTo(0.1,1.0),
        //     cc.hide(),
        //     cc.callFunc(()=>{
        //         this._ctrl.finishEat()
        //         node_.destroy()
        //     }),
        // ))
        KUN.GameTools.playAudio('gold1')
        node_.getChildByName('addCoin').getComponent(cc.Label).string = this._coin > 0 ? '+' + this._coin : this._coin
        node_.runAction(cc.sequence(cc.scaleTo(0.1,1.2),cc.scaleTo(0.1,1),cc.callFunc(()=>{
            this._ctrl.finishEat()
        }),cc.delayTime(0.5),cc.callFunc(()=>{
            node_.destroy()
        })))
    },

    changeFishSkin() {
        KUN.ResCache.setSpriteFrame(this.sprite, cc.js.formatStr('fish/yu%d',this.getFishIndex()))
    },

    eatenEvent() {
        this.node.x = 1280
        this.node.runAction(cc.sequence(cc.moveTo(this._showTime,cc.p(0,0)),cc.callFunc(()=>{
            this._ctrl.finishEatBefore()
        })))
    },


    onCollisionEnter(other, self) {
        //to do
        console.log('玩家碰撞触发')
        this.openMouth()
        if(this._fishData.flag == 'eat') {
            this._enemyCtrl = other.getComponent('Enemy')
        }
    },

    // onCollisionStay(other, self) {
    //     //to do
    // },

    // onCollisionExit(other, self) {
    //     // to do
    // },
});
