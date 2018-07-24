
cc.Class({
    extends: cc.Component,

    properties: {
        coin: cc.Label,
    },

    init(ctrl, priceList_) {
        // console.log('init-mapping')
        this._ctrl = ctrl
        this._priceList = priceList_
        this._pageView = this.getComponent('PageView')
        this._pageView.init()
        this._curFishPrice = 0
        this.node.on('page-view-start',this.turnningEventStart,this)
        this.node.on('page-view-end',this.turnningEventEnd,this)
    },

    turnningEventStart(e) {

    },
    // event.detail  // recive emit data //
    turnningEventEnd(e) {
        let level = this._pageView.getCurIndex() + 1
        let price = this._priceList[level]
        let flag = KUN.UserData.getLevel() == (level - 1)
        if(flag && price && price > 0) {
            this._curFishPrice = price
            this.coin.string = price
            this.coin.node.parent.active = true
        } else {
            this.coin.node.parent.active = false
        }
        // cheng item color
        this.tryChangeItemColor()
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

    tryChangeItemColor() {
        let minIndex = this._pageView.getMinIndex()
        let maxIndex = this._pageView.getMaxIndex()
        let curIndex = this._pageView.getCurIndex()

        this._pageView.getContentChild(this._pageView.getNextIndex()).color = new cc.Color(255,255,255,255)
        this._pageView.getContentChild(this._pageView.getLastIndex()).color = new cc.Color(255,255,255,255)

        if(curIndex == minIndex && (this._pageView.getNextIndex() + 1) - KUN.UserData.getLevel() > 1) {
            this._pageView.getContentChild(this._pageView.getNextIndex()).color = new cc.Color(0,0,0,255)
        } else if(curIndex == maxIndex && (this._pageView.getLastIndex() + 1) - KUN.UserData.getLevel() > 1) {
            this._pageView.getContentChild(this._pageView.getLastIndex()).color = new cc.Color(0,0,0,255)
        } else {
            if((this._pageView.getNextIndex() + 1) - KUN.UserData.getLevel() > 1)
                this._pageView.getContentChild(this._pageView.getNextIndex()).color = new cc.Color(0,0,0,255)
            if((this._pageView.getLastIndex() + 1) - KUN.UserData.getLevel() > 1)
                this._pageView.getContentChild(this._pageView.getLastIndex()).color = new cc.Color(0,0,0,255)
        }
    },
});
