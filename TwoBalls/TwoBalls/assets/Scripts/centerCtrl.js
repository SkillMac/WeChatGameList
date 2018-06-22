// reset type
// restart ,,, home ,,, normal
let GameTools = require('GameTools');
cc.Class({
    extends: cc.Component,

    properties: {
        player: {
            default: null,
            tooltip: "玩家",
            type: cc.Node,
        },
        enemy: {
            default: null,
            tooltip: "敌人",
            type: cc.Node,
        },
        ballDis: {
            displayName: "球之间距离系数",
            default: 1,
            tooltip: "值得区间是0-1",
        },
        score: {
            default: null,
            type: cc.Label,
            tooltip: "玩家分数label",
        },
        startDialog: {
            default: null,
            type: cc.Node,
            tooltip: "开始弹窗",
        },
        endDialog: {
            default: null,
            type: cc.Node,
            tooltip: "结束弹窗",
        },
        bg: {
            default: null,
            displayName: "游戏背景",
            type: cc.Sprite,
            tooltip: "主游戏的背景"
        },
        bgNext: {
            default: null,
            type: cc.Sprite,
        },
        showScore: cc.Label,
    },
    onLoad() {
        this.init();
        this.initData();
        this.onStartGameEvent();
        this.initEffectFire();
    },
    start () {
        this.endDialog.x = 10000;//active = false;
        this.score.node.active = false;
        this.showScore.node.active = false;
        this.enemy.active = false;
    },

    update (dt) {
        this.updateGameStatus();
    },

    updateGameStatus() {
        if(this.checkIsHit()) {
            // 更新状态
            this.playerCom.hide();
            this.enemyCom.hide();
            this.playFireEffect();
        }
        else {
            this.checkIsOver();
        }
    },

    updateScore() {
        this.score.string = cc.TB.GAME.score;
    },

    checkIsHit() {
        if(this.hitBallFlag) {
            return false;
        }
        let dis = cc.pDistance(this.player.getPosition(), this.enemy.getPosition());
        let a = dis < this.ballDis * (this.player.width/2 + this.enemy.scaleX * this.enemy.width/2);
        if(a && !this.hitBallFlag) {
            if(this.checkHitCenter()) {
                this.hitCounts += 1;
            }else {
                this.hitCounts = 0.5;
            }
            this.hitBallFlag = true;
            return true;
        }
        else {
            return false;
        }
    },

    checkHitCenter() {
        if(Math.abs(this.player.x - this.enemy.x)<= (this.player.width / 2)) {
            return true;
        }
        return false;
    },

    init() {
        cc.TB = {};
        cc.TB.GAME = require('gameStatus');
        let WCO = require('weChat');
        cc.TB.wco = new WCO();
        let wco = cc.TB.wco; 
        let self = this;

        // 微信登录
        let callfunc = function() {
            //console.log(cc.TB.GAME.weChatData);
        }
        wco.checkIsLogin(callfunc);     
        // 适配高度
        wco.adjustBgScaleY(this.bg.node);
        wco.adjustBgScaleY(this.bgNext.node);

        wco.registerOnGroupShareFunc((ticket) => {
            this.onGroupShare(ticket);
        });
    },

    initData() {
        cc.TB.GAME.gameOver = false;
        this.hitBallFlag = false;
        this.playerCom = this.player.getComponent('player');
        this.enemyCom = this.enemy.getComponent('enemy');
        this.globalGame = cc.TB.GAME;
        this.startUpBgFlag = false;
        this.hitCounts = 0;
    },

    initEffectFire() {
        this.effectNode = this.node.getChildByName('fireEffect');
    },

    playFireEffect() {
        let fireScript = this.effectNode.getComponent('fire');
        fireScript.playFireEffect(()=>{
            this.reset('normal');
        },this.enemy.getPosition(),this.enemy.scaleX);
        // 显示 加分效果
        this.playSocreEffect();
        // 数值加分
        this.addScore();
    },

    reset(type) {
        // 初始化状态
        this.hitBallFlag = false;
        this.updateScore();
        // 调用敌人/玩家的重置方法
        this.playerCom.reset();
        this.enemyCom.reset(type);
    },

    playSocreEffect() {
        if(this.hitCounts === 0){
            return;
        }
        let enemyPosY = this.enemy.y;
        this.showScore.node.y = enemyPosY;
        this.showScore.node.stopAllActions();
        this.showScore.string = '+' + this.globalGame.getShowScoreVal(this.hitCounts);
        this.showScore.node.active = true;
        this.showScore.node.opacity = 255;
        let moveY = this.enemy.width * this.enemy.scaleX / 2;
        this.showScore.node.runAction(cc.sequence(cc.moveBy(1,cc.p(0,moveY)),cc.fadeOut(0.3),cc.callFunc(()=>{
            this.showScore.node.active = false;
        })));
    },

    addScore() {
        this.globalGame.checkPoint += 1;
        let curAddScore = 1;
        if(this.hitCounts > 0) {
            curAddScore = this.globalGame.getShowScoreVal(this.hitCounts);
        }
        this.globalGame.score += curAddScore;
        this.updateScore();
        this.onCheckPointChange();
        if(this.hitCounts == 0.5) {
            this.hitCounts = 0;
        }
    },

    checkIsOver() {
        if(this.globalGame.isPlaying && this.playerCom.checkIsGameOver() && !this.globalGame.gameOver) {
            this.updateOverGameStatus();
            // 通知 UI 显示 结束面板
            if(this.endDialog.getComponent('endUICtrl').checkIsOver()) {
                // this.enemy.stopAllActions();
                this.enemyCom.stopMoveAction();
                // 清除 连击次数
                this.hitCounts = 0;
            }
            return true;
        }
        else {
            return false;
        }
    },

    updateOverGameStatus() {
        this.globalGame.gameOver = true;
        this.globalGame.isPlaying = false;
    },

    onCheckPointChange() {
        // 关卡改变时候开始回调
    },

    startUpBgUpdate() {
        if(this.startUpBgFlag) {
            return;
        }
        this.startUpBgFlag = true;
        let self = this;
        let index = 1;
        let bgZorder = this.bg.node.getLocalZOrder();
        let bgNext = this.bgNext;
        bgNext.node.opacity = 0;
        bgNext.node.active = false;
        
        let callfunc = function() {
            let filePath = cc.js.formatStr('bg/BG%d',index);
            cc.loader.loadRes(filePath, cc.SpriteFrame, function(err, spriteFrame){
                let fadeTime = self.globalGame.bgCfgData.bgFadeTime;
                self.bgNext.spriteFrame = spriteFrame;
                self.bgNext.node.active = true;
                self.bgNext.node.runAction(cc.sequence(cc.fadeIn(fadeTime),cc.callFunc(function(){
                    self.bg.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    self.bgNext.node.opacity = 0;
                    self.bgNext.node.active = false;
                })));
            });
            index +=1;
            index %= self.globalGame.bgCfgData.bgCounts;
        }
        this.bg.schedule(callfunc,this.globalGame.bgCfgData.bgChangeTime,cc.macro.REPEAT_FOREVER,this.globalGame.bgCfgData.bgChangeTime);
    },
    startBtnEvent() {
        // 敌人开始运动
        this.updateScore();
        this.score.node.active = true;
        let delayTime = this.playerCom.playTaskEffect();
        this.node.runAction(cc.sequence(cc.delayTime(delayTime),cc.callFunc(() => {
            this.enemyCom.playMoveAction();
        })));
    },
    // 事件监听
    onStartGameEvent() {
        let self = this;
        this.node.on('start_game_btn',function(event){
            event.stopPropagation();
            self.startUpBgUpdate();
            self.startBtnEvent();
        });
    },

    onEntryMainMenu() {
        this.score.node.active = false;
        this.enemy.active = false;
        this.startDialog.getComponent('startUICtrl').show();
        this.reset('home');
    },

    onGroupShare(shareTicket) {
        let self = this;
        cc.loader.loadRes("prefab/rank", cc.Prefab, function(err, prefab){
            let prefabNode = cc.instantiate(prefab);
            prefabNode.getComponent('rankCtrl').showGroupPic();
            self.node.addChild(prefabNode);
            GameTools.sendMessage({
                type: GameTools.msgType.groupShare,
                ticket: shareTicket,
                key: cc.TB.GAME.weChatData.keyList[0],
            });
        });
    }
});
