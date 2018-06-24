
let GameTools = require('GameTools');
cc.Class({
    extends: cc.Component,

    properties: {
        backBtn: cc.Node,
        groupBtn: cc.Node,
        friendPic: cc.Sprite,
        rankView: cc.Sprite,
        groupPic: cc.Sprite,
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
                keyList:cc.TB.GAME.weChatData.keyList,
            });
        }
    },
    update() {
        this._updateSubDomainCanvas()
    },
    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (CC_WECHATGAME) {
            if (window.sharedCanvas != undefined) {
                this.tex.initWithElement(window.sharedCanvas)
                this.tex.handleLoadedTexture()
                this.rankView.spriteFrame = new cc.SpriteFrame(this.tex)
            }
        }
    },
    // init data
    initData(){
        this.nextPicName = 'world'
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
        this.node.destroy()
    },
    groupBtnEvent(event) {
        // 查看群排行
        cc.TB.wco.groupShare('share')
    },
    friendPicEvent(event) {
        event.stopPropagation()
        // 图片的更换
        let self = this;

        cc.resCache.setSpriteFrame(this.friendPic,"rankRes/"+this.nextPicName)

        if(self.nextPicName === "friend") {
            self.nextPicName = "world"
            // 显示好友排行
        }else {
            self.nextPicName = "friend"
            // 显示世界排行
        }
    },

    showGroupPic() {
        this.groupPic.node.active = true
        this.friendPic.node.active = false
    },
});
