
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
    },

    onLoad () {
        this.initData();
        this.initClickEvent();

        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
        }
    },

    update() {
        this._updateSubDomainCanvas();
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
        this.overDialogFlag = false;
        this.updateRankViewFlag = true;
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
        // 初始化状态
        this.node.parent.getComponent('centerCtrl').onEntryMainMenu();
        this.hide();
    },

    reStart(event) {

        this.hide();
        this.sendRestartEvent();
        this.globalGame.isPlaying = true;
    },

    show() {
        this.updateRankViewFlag = true;
        this.node.active = true;
    },

    hide() {
        this.globalGame.score = 0;
        this.globalGame.checkPoint = 0;
        this.overDialogFlag = false;
        this.node.active = false;
        this.updateScore();
        this.globalGame.gameOver = false;
        // 清除孩子
        GameTools.sendMessage({
            type: GameTools.msgType.clear,
        });
    },

    checkIsOver() {
        if(this.globalGame.gameOver && !this.overDialogFlag) {
            // 更新状态
            this.overDialogFlag = true;
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

    sendRestartEvent() {
        this.node.parent.getComponent('centerCtrl').reset('restart');
    },

    groupShareBtnEvent(event) {
        cc.TB.wco.groupShare('dare');
    },

    rankBtnEvent(event) {
        let self = this;
        this.updateRankViewFlag = false;
        cc.loader.loadRes("prefab/rank", cc.Prefab, function(err, prefab){
            let node = cc.instantiate(prefab);
            self.node.parent.addChild(node);
        });
    },
});
