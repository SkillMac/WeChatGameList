
let T = cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init( params ){
        // hide_panel_func, need_friend_relife_func) {
        this.call_back = params.hide_panel_func
        this.need_friend_relife_func = params.need_friend_relife_func
        this.need_friend_relife_fail_func = params.need_friend_relife_fail_func
    },

    offBtnEvent(event, params, delayTime) {
        delayTime = delayTime ? delayTime : 0;
        this.node.runAction(cc.sequence(cc.delayTime(delayTime),cc.callFunc(()=>{
            if(this.call_back) {
                this.call_back()
            }
            this.node.destroy()
        })));
    },

    // 向好友求助复活
    needFriendRelife(event, params) {
        cc.TB.wco.groupShare('relife',()=>{
            if(this.need_friend_relife_func) {
                this.need_friend_relife_func()
            }
        }, ()=>{
            if(this.need_friend_relife_fail_func) {
                this.need_friend_relife_fail_func()
            }
        })
        this.offBtnEvent()
    },

    // 赠送礼物
    giftBtnEvent(event, params) {
        this.offBtnEvent()
    },

    // 观看广告
    adBtnEvent(event, params) {

    }
});

export default T;