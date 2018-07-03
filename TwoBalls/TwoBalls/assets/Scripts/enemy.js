
let GameTools = require('GameTools');
cc.Class({
    extends: cc.Component,

    properties: {
        moveSpeedX: {
            default: 50,
            tooltip: "小球每秒移动的速度",
        },
        moveDistance: {
            default: 200,
            tooltip: "小球左右移动的总距离",
        },
        center: cc.Node,
    },

    init() {
        this.initData()
        this.loadEnemySkin()
        this.node.active = false
        this.center.active = false
        // this.schedule(()=>{
        //     this._update();
        // },0.01,cc.macro.REPEAT_FOREVER,0);
    },

    _update(dt) {
        this.move(dt)
    },

    move(dt) {
        if(this.curMoveDir === 1 && this.node.x >= (this.moveDistance / 2)) {
            this.curMoveDir = -1
        }
        else if(this.curMoveDir === -1 && this.node.x <= (- this.moveDistance / 2)) {
            this.curMoveDir = 1
        }
        let curMoveDis = this.curMoveDir * this._speed * dt
        this.node.x += Math.round(curMoveDis)
    },

    playMoveAction() {
        this.node.opacity = 255
        this.node.active = true
        let delayTime = this.halfMoveAction()
        this.node.runAction(cc.sequence(cc.delayTime(delayTime), cc.callFunc(this.hMoveAction, this)))
        // test
        this._speed = this.moveSpeedX
        this.curMoveDir = 1
        this.center.stopAllActions()
        this.center.opacity = 255
        this.center.active = true
        let show_hide_time = this.gameStatus.enemyCenterShowTime
        let repeatCounts = 3
        
        this.center.runAction(cc.repeat(cc.sequence(cc.fadeIn(show_hide_time),cc.fadeOut(show_hide_time)),repeatCounts));
        this.center.runAction(cc.sequence(cc.delayTime(repeatCounts*show_hide_time*2),cc.callFunc(()=>{
            this.center.active = false
        })));
    },

    stopMoveAction() {
        this._speed = 0
        this.curMoveDir = 0
        this.node.stopAllActions()
    },

    halfMoveAction: function() {
        let moveData = this.getHMoveActionParams()
        let delayTime = moveData.moveTime / 2
        this.node.runAction(cc.moveTo(delayTime,moveData.rightPos))
        return delayTime
    },

    hMoveAction: function() {
        let moveData = this.getHMoveActionParams()
        let move2RightAction = cc.moveTo(moveData.moveTime, moveData.rightPos)
        let move2LeftAction = cc.moveTo(moveData.moveTime, moveData.leftPos)
        let repeatAction = cc.repeatForever(cc.sequence(move2LeftAction, move2RightAction))
        this.node.runAction(repeatAction)
    },

    getHMoveActionParams: function() {
        let moveTime = this.moveDistance / this.moveSpeedX
        let leftPos  = cc.p(-this.moveDistance / 2, this.node.y)
        let rightPos = cc.p(this.moveDistance / 2, this.node.y)
        return {moveTime, leftPos, rightPos}
    },

    initData() {
        this.gameStatus = cc.TB.GAME
        this.sprite = this.node.getComponent(cc.Sprite)
        this._atlasCahce = null
        this._speed = 0
        this.curMoveDir = 1
        this.curScale = 1
        this._curEnemyPicIndex = -1
    },

    reset(type) {
        this.node.stopAllActions();
        this.stopMoveAction()
        this.setRandomData()
        // this.node.active = true;
        this.show(type)
    },
    show(type) {
        if(type == 'normal' || type == 'restart') {
            this.node.active = true
        }
        this.node.opacity = 0;
        this.node.setScale(this.curScale* this.gameStatus.enemyStartScaleMul);
        let scaleTime = this.gameStatus.enemyShowScaleTime;
        let fadeTime = this.gameStatus.enemyFadeTime;
        // this.node.stopAllActions()
        this.node.runAction(cc.spawn(cc.scaleTo(scaleTime,this.curScale),cc.fadeIn(fadeTime)));
        this.node.runAction(cc.sequence(cc.delayTime(scaleTime),cc.callFunc(()=>{
            if(type == 'normal' || type == 'restart') {
                this.playMoveAction();
            }
        })));
    },
    hide() {
        this.node.active = false;
        this.stopMoveAction();
        this.node.x = 0;
    },

    randomData() {
        let GameStatus_ = this.gameStatus;
        let tarCheckPoint = GameStatus_.targetCheckPoint;
        let checkPointSize = GameStatus_.enemyProbabilitySize.length;
        // 当前概率的索引
        let curProbIndex = 0;
        if(GameStatus_.checkPoint >= GameStatus_.targetCheckPoint){
            curProbIndex = checkPointSize-1;
        }
        else {
            curProbIndex = Math.floor(GameStatus_.checkPoint / (tarCheckPoint / checkPointSize));
        }
        let curSizeIndex = GameStatus_.getRandom(GameStatus_.enemyProbabilitySize[curProbIndex]);
        let curSize = GameStatus_.enemySize[curSizeIndex];

        let curPosYIndex = GameStatus_.getRandom(GameStatus_.enemyProbabilityDis[curProbIndex]);
        let curPosY = GameStatus_.enemyDis[curPosYIndex];

        let curSpeedXIndex = GameStatus_.getRandom(GameStatus_.enemyProbabilitySpeed[curProbIndex]);
        let curSpeedX = GameStatus_.enemySpeed[curSpeedXIndex];

        //cc.log('小球的倍数: '+ curSize + "| 小球的位置: " + curPosY + "| 小球移动速度: " + curSpeedX);

        return {'size':curSize/2, 'posY': curPosY, 'speedX': curSpeedX};
    },

    setRandomData() {
        // 更新纹理
        this.updateSelfPic();
        let data = this.randomData();
        this.curScale = data.size;
        this.node.setScale(data.size);
        this.center.setScale(2/data.size)
        this.node.y = data.posY;
        this.node.x = 0;
        this.moveSpeedX = data.speedX;
    },

    updateSelfPic() {
        let self = this;
        let GameStatus_ = this.gameStatus;
        let enemyPic = GameStatus_.getRandom(GameStatus_.enemyProbabilityPic) + 1;
        this._curEnemyPicIndex = enemyPic
        let curSpriteFrame = this._atlasCahce.getSpriteFrame(""+enemyPic);
        this.sprite.spriteFrame = curSpriteFrame;
    },

    loadEnemySkin() {
        this._atlasCahce = cc.resCache.getEnemyCache()
        this.setRandomData()
    },

    getSkinIndex() {
        return this._curEnemyPicIndex
    },
});
