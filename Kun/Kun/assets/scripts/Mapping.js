
cc.Class({
    extends: cc.Component,

    properties: {
        pageView: cc.PageView,
        coin: cc.Label,
        content: cc.Node,
        enemyPreb: cc.Prefab,
    },

    init(ctrl, priceList_) {
        // console.log('init-mapping')
        this._ctrl = ctrl
        this._priceList = priceList_
        this._curFishPrice = 0
        this.node.on('page-turning',this.turnningEvent,this)
    },

    turnningEvent(e) {
        let level = this.pageView.getCurrentPageIndex() + 1
        this.buildNewFishCard(level)
        let price = this._priceList[level-1]
        let flag = KUN.UserData.getLevel() == (level - 1)
        if(flag && price && price > 0) {
            this._curFishPrice = price
            this.coin.string = price
            this.coin.node.parent.active = true
        } else {
            this.coin.node.parent.active = false
        }
    },

    purchaseEvent(e,p) {
        // console.log('购买鱼的价格',this._curFishPrice)
        this._ctrl.purchaseNewFish(this._curFishPrice,(res)=>{
            if(res.status == 'ok') {
                console.log('购买成功')
                // purchase success
            } else if(res.status == '-1') {
                // fail
                console.log('金币不足')
            }
        })
    },

    showOrHied() {
        this.coin.node.parent.active = false
        return this.getComponent('Common').show2()
    },

    buildNewFishCard(level) {
        let node_ = cc.instantiate(this.enemyPreb)
        // console.log(node_.getComponent(cc.Sprite),'level',level+2)
        KUN.ResCache.setSpriteFrame(node_.getComponent(cc.Sprite),'fish/yu' + (level + 2))
        node_.setScale(0.7)
        this.content.addChild(node_)
    }
});
