
let parentPanelCtrl = require('PanelCtrl')
cc.Class({
    extends: parentPanelCtrl,

    properties: {
        time: cc.Label,
    },

    init(params) {
        this._super(params)
        this.leftTime = 8
        this.startUpTimer()
    },

    offBtnEvent(event, params) {
        this.time.node.stopAllActions()
        // 在外面面板也有调用
        this.node.runAction(cc.sequence(cc.scaleTo(0.2,0),cc.callFunc(()=>{
            if(params != 'relife' && this.need_friend_relife_fail_func) {
                this.need_friend_relife_fail_func()
            }
            if(this.call_back) {
                this.call_back()
            }
            this.node.destroy()
        })))
    },

    needFriendRelife(event, params) {
        this.time.node.stopAllActions()
        cc.TB.wco.groupShare('relife',(res)=>{
            if(res.shareTickets) {
                if(this.need_friend_relife_func) {
                    this.need_friend_relife_func()
                    this.offBtnEvent(null,'relife')
                }
            } else {
                this.shareFail()
            }
            
        }, (res)=>{
            this.shareFail()
        })
    },

    startUpTimer() {
        this.time.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1),cc.callFunc(()=>{
            if(this.leftTime < 0) {
                this.offBtnEvent();
                return
            }
            this.time.string = this.leftTime
            this.leftTime --;
        }))));
    },

    shareFail() {
        this.startUpTimer()
        this.showFailTipsMsg()
    },
});
