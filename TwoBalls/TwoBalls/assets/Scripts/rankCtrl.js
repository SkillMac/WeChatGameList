// 禁掉世界排行榜
let GameTools = require('GameTools');
cc.Class({
    extends: cc.Component,

    properties: {
        backBtn: cc.Node,
        groupBtn: cc.Node,
        friendPic: cc.Sprite,
        rankView: cc.Sprite,
        groupPic: cc.Sprite,
        rank_bg: cc.Sprite, // 排行榜的背景
    },
    onLoad() {
        this.initData()
        this.registerEvent()
        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D()
            window.sharedCanvas.width = 720
            window.sharedCanvas.height = 1280
        }
    },
    start () {
        if(!this.groupPic.node.active) {
            GameTools.sendMessage({
                type: GameTools.msgType.updateRank,
                keyList:[cc.TB.GAME.weChatData.keyList[0]],
            });
        }
        this.onSlideRankEvent()
    },
    update() {
        this._updateSubDomainCanvas()
    },
    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (CC_WECHATGAME) {
            if (window.sharedCanvas != undefined && this.tex) {
                this.tex.initWithElement(window.sharedCanvas)
                this.tex.handleLoadedTexture()
                if((!this.rankView.spriteFrame) || this.rankView.spriteFrame && this.rankView.spriteFrame.isValid)
                    this.rankView.spriteFrame = new cc.SpriteFrame(this.tex)
            }
        }
    },
    // init
    init(call_back) {
        this.call_back = call_back
        cc.TB.GAME.panelBgDestroyFunc = ()=>{
            this.backBtnEvent()
        }
    },

    // init data
    initData(){
        this.nextPicName = 'hit'
        this.isHitRankFlag = false
    },
    // register btn event
    registerEvent(){
        this.backBtn.on('click',this.backBtnEvent,this)
        this.groupBtn.on('click',this.groupBtnEvent,this)
        this.friendPic.node.on('touchstart',this.friendPicEvent,this)
    },

    // btn event
    backBtnEvent(event) {
        //this.node.active = false;
        // console.log(this.call_back)
        if(this.call_back) {
            this.call_back()
        }
        GameTools.destroy(this.node);
    },
    groupBtnEvent(event) {
        // 查看群排行
        // this.backBtnEvent()
        cc.TB.wco.groupShare('groupShare',res => {
            if(!res.shareTickets) {
                cc.loader.loadRes('prefab/Tips1', cc.Prefab, (err, prefab)=>{
                    let node = cc.instantiate(prefab)
                    node.getComponent('showMsgEffect').show2()
                    this.node.addChild(node)
                })
            }
        })
    },
    friendPicEvent(event) {
        event.stopPropagation()
        // 图片的更换
        cc.resCache.setSpriteFrame(this.friendPic,"rankRes/"+this.nextPicName)

        if(this.nextPicName === "friend") {
            this.isHitRankFlag = false
            this.nextPicName = "hit"
            // 连击排行
            GameTools.sendMessage({
                type: GameTools.msgType.updateRank,
                keyList:[cc.TB.GAME.weChatData.keyList[0]],
            });
        }else {
            this.nextPicName = "friend"
            // 好友排行排行
            this.isHitRankFlag = true
            GameTools.sendMessage({
                type: GameTools.msgType.hitCenterRank,
                keyList:[cc.TB.GAME.weChatData.keyList[1]],
            });
        }
    },

    showGroupPic() {
        this.groupPic.node.active = true
        this.friendPic.node.active = false
    },

    onSlideRankEvent() {
        this.rank_bg.node.on('touchmove',(event)=>{
            GameTools.sendMessage({
                type: GameTools.msgType.slideRank,
                y: event.getDelta().y,
                isHitRank: this.isHitRankFlag,
            })
        })
    }
});
