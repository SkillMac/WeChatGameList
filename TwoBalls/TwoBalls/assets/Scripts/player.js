
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
    },

    onLoad: function() {
        this.initData();
    },

    start: function () {

    },

    update: function(dt) {
        this.moveUp(dt);
    },

    initData: function() {
        this.speedY = 0;
        this.startPos = this.node.getPosition();
        this.tailParticleCom = this.node.getChildByName('tail').getComponent(cc.ParticleSystem);
        // this.audio = this.node.getComponent(cc.AudioSource);
        this.isMove = true;
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
});
