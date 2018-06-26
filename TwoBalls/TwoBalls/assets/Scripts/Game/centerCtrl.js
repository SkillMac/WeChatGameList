// reset type
// restart ,,, home ,,, normal
// score color
let scoreColor = [
    new cc.Color(254,161,0),
    new cc.Color(179,216,207),
    new cc.Color(255,246,0),
    new cc.Color(255,82,82),
]
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
        panel_bg: cc.Sprite,
        relifePrefab: cc.Prefab,
        // circlePic: cc.Sprite,
        urgePrefab: cc.Prefab,
    },
    onLoad() {
        // cc.log('游戏场景onLoad');
        this.init()
        this.initData()
        this.enemyCom.init()
        this.playerCom.init()
        this.onStartGameEvent()
        this.initEffectFire()
    },
    start () {
        // cc.log('游戏场景start');
        this.showScore.node.active = false;
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
        // todo
        this.relifeFlag = false
        this.checkIsOverFlag = false
    },

    initData() {
        cc.TB.GAME.gameOver = false;
        this.hitBallFlag = false;
        this.playerCom = this.player.getComponent('player');
        this.enemyCom = this.enemy.getComponent('enemy');
        this.globalGame = cc.TB.GAME;
        this.startUpBgFlag = false;
        this.hitCounts = 0;
        this.showScore.level = 0;
        this.panel_bg.node.active = false
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
        this.checkIsOverFlag = false
        this.hitBallFlag = false;
        this.updateScore();
        // 调用敌人/玩家的重置方法
        this.playerCom.reset();
        this.enemyCom.reset(type);
    },

    playSocreEffect() {
        // scoreColor
        if(this.hitCounts === 0){
            return;
        }
        if(this.showScore.level >3) {
            this.showScore.level = 3
        }
        if(this.hitCounts === 0.5) {
            this.showScore.level = 0
        }
        let enemyPosY = this.enemy.y
        this.showScore.node.y = enemyPosY
        this.showScore.node.stopAllActions()
        this.showScore.string = '+' + this.globalGame.getShowScoreVal(this.hitCounts)
        // console.log('连击次数,,,,颜色等级',this.hitCounts,this.showScore.level);
        this.showScore.node.color = scoreColor[this.showScore.level]
        this.showScore.level ++;
        this.showScore.node.active = true
        this.showScore.node.opacity = 255
        let moveY = this.enemy.width * this.enemy.scaleX / 2
        this.showScore.node.runAction(cc.sequence(cc.moveBy(1,cc.p(0,moveY)),cc.fadeOut(0.3),cc.callFunc(()=>{
            this.showScore.node.active = false
        })));
        this.playUrgeEffect(this.hitCounts)
        // cc.audioEngine.play(cc.url.raw(cc.js.formatStr('resources/audio/broke%d.mp3',this.showScore.level)))
    },

    playUrgeEffect(level) {
        if(level >= 1) {
            let node = cc.instantiate(this.urgePrefab)
            let curLocalZorder = this.showScore.node.getLocalZOrder()
            node.getComponent('urgeEffect').init(level)
            node.setPosition(cc.pAdd(this.enemy.getPosition(),cc.p(100,100)))
            this.node.addChild(node)
        }
    },

    playeCircleEffect(level) {
        // 播放 击中效果
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
        if(this.globalGame.isPlaying && this.playerCom.checkIsGameOver() && !this.globalGame.gameOver && !this.checkIsOverFlag) {
            this.checkIsOverFlag = true
            // 停止现象
            this.enemyCom.stopMoveAction();
            // 清除 连击次数
            this.hitCounts = 0;
            // 检查是否可以复活
            if(this.checkIsRelife()){
                return false
            } else {
                this.gameOver()
            }
        }
        else {
            return false;
        }
    },

    gameOver() {
        // dead
        // 更新游戏状态
        this.updateOverGameStatus();
        // 停掉 背景调度
        this.bg.unscheduleAllCallbacks();
        // 切换结束场景
        this.toGameOverScene()
        return true;
    },

    updateOverGameStatus() {
        this.globalGame.gameOver = true;
        this.globalGame.isPlaying = false;
    },

    toGameOverScene() {
        //OverScene
        cc.director.loadScene('OverScene');
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
                self.bgNext.getComponent(cc.Widget).updateAlignment()
                self.bgNext.node.active = true;
                self.bgNext.node.runAction(cc.sequence(cc.fadeIn(fadeTime),cc.callFunc(function(){
                    self.bg.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    self.bg.getComponent(cc.Widget).updateAlignment()
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
        let delayTime = 0;//this.playerCom.playTaskEffect();
        // this.node.runAction(cc.sequence(cc.delayTime(delayTime),cc.callFunc(() => {
        //     this.enemyCom.playMoveAction();
        // })));
        this.enemyCom.playMoveAction()
    },
    // 事件监听
    onStartGameEvent() {
        this.startUpBgUpdate();
        this.startBtnEvent();
    },

    relife() {
        // 清除连击
        this.hitCounts = 0
        this.reset('normal')
    },

    checkIsRelife() {
        if(!this.relifeFlag) {
            this.relifeFlag = true
            this.panel_bg.node.active = true
            let node = cc.instantiate(this.relifePrefab)
            node.getComponent('RelifePanelCtrl').init({
                hide_panel_func: ()=>{
                    this.panel_bg.node.active = false
                },
                need_friend_relife_func: ()=> {
                    this.relife()
                },
                faile_need_friend_relife_func: ()=> {
                    // 点击关闭按钮
                    this.gameOver()
                },
                need_friend_relife_fail_func: ()=> {
                    // 取消分享回调
                    this.gameOver()
                }
            });
            this.node.addChild(node)
            return true
        }
        return false
    },
});
