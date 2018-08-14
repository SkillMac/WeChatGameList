let GameTools = require('GameTools');

let T = cc.Class({
    extends: cc.Component,

    properties: {
    },

    init( params ){
        // hide_panel_func, need_friend_relife_func) {
        this.call_back = params.hide_panel_func
        this.need_friend_relife_func = params.need_friend_relife_func
        this.need_friend_relife_fail_func = params.need_friend_relife_fail_func
        // 奖励金钱的回调
        this.urge_func = params.urge_func
        cc.TB.GAME.panelBgDestroyFunc = ()=>{
            this.offBtnEvent()
        }
    },

    offBtnEvent(event, params, delayTime) {
        delayTime = delayTime ? delayTime : 0;
        this.node.runAction(cc.sequence(cc.delayTime(delayTime),cc.callFunc(()=>{
            if(this.call_back) {
                this.call_back()
            }
            GameTools.destroy(this.node);
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
        // this.offBtnEvent()
        cc.TB.wco.groupShare('gift',(res)=>{
            if(!res.shareTickets) {
                this.showFailTipsMsg()
            } else {
                cc.TB.GAME.giftSkinIndex = ''+params
                if(!(cc.director.getScene().name == 'MainGame')) {
                    // 清理开始时候的数据
                    cc.TB.GAME.initStartData()
                    cc.TB.GAME.isPlaying = true
                    // 直接跳转游戏
                    cc.director.loadScene('MainGame')
                } else {
                    cc.director.getScene().getChildByName('Canvas').getChildByName('player').getComponent('player').checkChangeSkin()
                    this.offBtnEvent()
                }
            }
        }, (res) => {
            this.showFailTipsMsg()
        },{
            index: params,
            time: new Date().getTime()
        })
    },

    // 观看广告
    adBtnEvent(event, params) {

    },

    showFailTipsMsg(msg) {
        cc.loader.loadRes('prefab/Tips1', cc.Prefab, (err, prefab)=>{
            let node = cc.instantiate(prefab)
            node.getComponent('showMsgEffect').show2()
            if(msg) {
                node.getChildByName('tips').getComponent(cc.Label).string = msg
            }
            this.node.addChild(node)
        })
    },

    urgeBtnEvent(event, params) {
        if(this.urge_func) {
            this.urge_func()
        }
        this.offBtnEvent()
    }
});

export default T;