
cc.Class({
    extends: cc.Component,

    properties: {
        pageView: cc.PageView,
        coin: cc.Label,
    },

    init(ctrl, priceList_) {
        // console.log('init-mapping')
        this._ctrl = ctrl
        this._priceList = priceList_
        this._curFishPrice = 0
        this.node.on('page-turning',this.turnningEvent,this)
    },

    turnningEvent(e) {
        let price = this._priceList[this.pageView.getCurrentPageIndex()]
        if(price && price > 0) {
            this._curFishPrice = price
            this.coin.string = price
            this.coin.node.parent.active = true
        } else {
            this.coin.node.parent.active = false
        }
    },

    purchaseEvent(e,p) {
        // console.log('购买鱼的价格',this._curFishPrice)
    },

});
