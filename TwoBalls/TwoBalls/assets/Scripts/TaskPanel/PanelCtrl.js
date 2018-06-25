
let T = cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init( params ){
        // hide_panel_func, need_friend_relife_func) {
        this.call_back = params.hide_panel_func
        this.need_friend_relife_func = params.need_friend_relife_func
    },

    offBtnEvent(event,params) {
        if(this.call_back) {
            this.call_back()
        }
        this.node.destroy()
    },

    // 向好友求助复活
    needFriendRelife(event, params) {
        cc.TB.wco.groupShare('relife',()=>{
            if(this.need_friend_relife_func) {
                this.need_friend_relife_func()
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