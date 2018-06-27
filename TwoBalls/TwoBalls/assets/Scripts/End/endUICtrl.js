
let GameTools = require('GameTools');
cc.Class({
    extends: cc.Component,

    properties: {
        score: {
            default: null,
            type: cc.Label,
            tooltip: "分数",
        },
        rankView: cc.Sprite,
        rankBtn: cc.Node,
        dareBtn: cc.Node,
        panelBg: cc.Node
    },

    onLoad () {
        this.initData()
        this.initClickEvent()
        this.checkIsOver()

        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D()
            window.sharedCanvas.width = 720
            window.sharedCanvas.height = 1280
        }
    },

    update() {
        this._updateSubDomainCanvas()
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (CC_WECHATGAME && this.updateRankViewFlag) {
            if (window.sharedCanvas != undefined) {
                this.tex.initWithElement(window.sharedCanvas);
                this.tex.handleLoadedTexture();
                this.rankView.spriteFrame = new cc.SpriteFrame(this.tex);
            }
        }
    },

    initData() {
        this.globalGame = cc.TB.GAME;
        this.updateRankViewFlag = true;
        cc.TB.GAME.giftSkinIndex = '-1'
    },

    initClickEvent() {
        this.addClickEvent('home_btn',this.homeBtnVent);
        this.addClickEvent('restart_btn',this.reStart);
        this.dareBtn.on('click', this.groupShareBtnEvent,this);
        this.rankBtn.on(cc.Node.EventType.TOUCH_END, this.rankBtnEvent,this);
    },

    addClickEvent(nodeName, func) {
        let node = this.node.getChildByName(nodeName)
        node.on('click',func,this);
    },

    homeBtnVent(event) {
        this.hide(()=>{
            cc.director.loadScene('StartScene')
        });
    },

    reStart(event) {
        this.hide(()=>{
            cc.director.loadScene('MainGame')
        });
    },

    show() {
        this.updateRankViewFlag = true;
        this.node.x = 0;
    },

    hide(func_) {
        this.globalGame.score = 0;
        this.globalGame.checkPoint = 0;
        this.globalGame.gameOver = false;
        this.globalGame.isPlaying = true;
        this.node.runAction(cc.sequence(cc.fadeOut(0.35),cc.callFunc(()=>{
            if (func_) {
                func_()
            }
        })));
    },

    checkIsOver() {
        if(this.globalGame.gameOver) {
            // 跟新分数
            this.updateScore();
            // 分数上传
            cc.TB.wco.uploadScore(this.globalGame.score);
            // 显示好友排行榜
            GameTools.sendMessage({
                type: GameTools.msgType.updateSelfRank,
                keyList:cc.TB.GAME.weChatData.keyList,
            });
            // 显示结束面板
            this.show();
            return true;
        }
        return false;
    },

    updateScore() {
        this.setScore(this.globalGame.score);
    },

    setScore(val) {
        this.score.string = val;
    },

    groupShareBtnEvent(event) {
        cc.TB.wco.groupShare('dare');
    },

    rankBtnEvent(event) {
        let self = this;
        this.panelShow()
        this.updateRankViewFlag = false;
        cc.loader.loadRes("prefab/rank", cc.Prefab, function(err, prefab){
            let node = cc.instantiate(prefab);
            node.getComponent('rankCtrl').init(()=>{
                self.panelHide()
            });
            self.node.parent.addChild(node);
        });
    },

    panelShow() {
        this.panelBg.active = true
    },

    panelHide() {
        this.panelBg.active = false
    },
});
