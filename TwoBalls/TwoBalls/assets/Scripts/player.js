
let GameTools = require('GameTools');
cc.Class({
    extends: cc.Component,

    properties: {
        moveSpeedY: {
            default: 250,
            tooltip: "小球每秒的移动速度",
        },
        audioShoot: {
            default: null,
            url: cc.AudioClip,
        },
        aniam: cc.Animation,
    },

    onLoad: function() {
        this.initData();
    },

    start: function () {

    },

    lateUpdate: function(dt) {
        this.moveUp(dt);
    },

    initData: function() {
        this.speedY = 0;
        this.startPos = this.node.getPosition();
        this.tailParticleCom = this.node.getChildByName('tail').getComponent(cc.ParticleSystem);
        // this.audio = this.node.getComponent(cc.AudioSource);
        this.isMove = true;
        this.bigLevel = 1;
        this.speedLevel = 1;
        this.factSizeWidth = this.node.width;
    },

    moveUp: function(dt) {
        if(this.speedY > 0) {
            this.node.y += this.speedY * dt;
        }
    },

    reset() {
        this.setSpeedY(0);
        this.node.setPosition(this.startPos);
        this.tailParticleCom.resetSystem();
        this.show();
    },
    
    show() {
        this.node.opacity = 0;
        this.node.active = true;
        this.isMove = false;
        this.node.runAction(cc.sequence(cc.fadeIn(cc.TB.GAME.enemyFadeTime),cc.callFunc(()=>{
            this.isMove = true;
        })));
    },
    hide() {
        this.node.active = false;
    },
    // set get 
    setSpeedY(speedY_) {
        if(this.isMove && speedY_ === this.speedY){
            return;
        }
        if(speedY_ != 0) {
            cc.audioEngine.play(this.audioShoot,false,1);
            // this.audio.play();
        }
        this.speedY = speedY_;
    },

    checkIsGameOver() {
        let posY = this.node.y;
        let height = cc.TB.GAME.getDesignSize().height;
        if(posY > height){
            return true;
        }
        else {
            return false;
        }
    },

    // 播放任务效果
    playTaskEffect() {
        let flag = false;
        let big_val = 0;
        let speed_val = 0;
        let delay_time = 0;
        let scaleTime = 0.5;
        if(this.bigLevel < cc.TB.GAME.bigLevel) {
            big_val = cc.TB.GAME.bigLevel - this.bigLevel;
            this.bigLevel  = cc.TB.GAME.bigLevel;
            flag = true;
        }
        if(this.speedLevel < cc.TB.GAME.speedLevel) {
            speed_val = cc.TB.GAME.speedLevel - this.speedLevel;
            this.speedLevel = cc.TB.GAME.speedLevel;
            flag = true;
        }
        if (flag) {
            this.aniam.node.setScale(this.node.scaleX * 1.5);
            let animState = this.aniam.play();
            delay_time = animState.duration/animState.speed;
            this.isMove = false;
            let addSize = big_val * cc.TB.GAME.playerAddSize/this.factSizeWidth;
            this.node.runAction(cc.sequence(cc.delayTime(delay_time),cc.scaleTo(scaleTime,this.node.scaleX+addSize),cc.callFunc(() => {
                this.isMove = true;
            })));
            this.moveSpeedY += (cc.TB.GAME.playerAddSpeed*speed_val);
            console.log('延时',delay_time, " | addSize", addSize, "| 当前速度", this.moveSpeedY);
            delay_time += scaleTime;

            let showText = "";
            
            if(big_val > 0 && speed_val > 0){
                showText += '大小+' + big_val + '级 速度+' + speed_val + '级';
            }
            else if(big_val > 0) {
                showText += '大小+'+ big_val+'级';
            }else if (speed_val > 0) {
                showText += '速度+'+speed_val+'级';
            }
            if(showText !== '') {
                // 文字显示
                GameTools.showLabelEffect(this.node.parent,this.node.getPosition(), showText, cc.p(0,100), 0.75, 0.75, 0);
            }
        }
        return delay_time;
    }
});
