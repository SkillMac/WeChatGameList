import BasePanel from "BasePanel";

cc.Class({
    extends: BasePanel,

    properties: {
        
    },

    init(ctrl,callback) {
        KUN.GameStatus.status = KUN.GameStatus.statusList[4]
        this._super(ctrl,callback)
        this.flagList = []
        this._endFunc = ()=>{
            KUN.GameStatus.status = KUN.GameStatus.statusList[2]
        }
        return this
    },

    hBEvent(e,p) {
        //let obj = e.target
        // to do
        KUN.WeChat.groupShare('FreeEnergy',res=>{
            console.log('分享成功', res)
            if(!res.shareTickets) {
                KUN.WeChat.tellMainCtrl(KUN.GameStatus.weChatFuncType.fail)
            } else {
                KUN.WeChat.tellMainCtrl(KUN.GameStatus.weChatFuncType.freeEnergy)
            }
        },res1=>{
            console.log('分享失败', res1)
            KUN.WeChat.tellMainCtrl(KUN.GameStatus.weChatFuncType.fail)
        })
    },
});
