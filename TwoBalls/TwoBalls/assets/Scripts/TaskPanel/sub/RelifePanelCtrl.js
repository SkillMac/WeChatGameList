
let parentPanelCtrl = require('PanelCtrl')
cc.Class({
    extends: parentPanelCtrl,

    properties: {
        time: cc.Label,
    },

    init(params) {
        this._super(params)
        let leftTime = 8
        this.faile_need_friend_relife_func = params.faile_need_friend_relife_func
        this.time.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(1),cc.callFunc(()=>{
            if(leftTime < 0) {
                this.time.node.stopAllActions()
                this.offBtnEvent();
                if (params.faile_need_friend_relife_func) {
                    params.faile_need_friend_relife_func()
                }
            }
            this.time.string = leftTime
            leftTime --;
        }))));
    },

    offBtnEvent(event, params) {
        this._super(event, params)
        if(params == '1' && this.faile_need_friend_relife_func) {
            this.time.node.stopAllActions()
            this.faile_need_friend_relife_func()
        }
    },

    needFriendRelife(event, params) {
        this._super(event, params)
        this.time.node.stopAllActions()
    }
});
