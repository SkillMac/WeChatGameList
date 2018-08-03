
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(ctrl,clipNameList=[]) {
        this.initData_p(ctrl)
        this.showy()
        this.addClipByList(clipNameList)
    },

    initData_p(ctrl) {
        this._isPlayNativeAnimaFlag = false
        this._isUserDragonBones = false
        if(this._isUserDragonBones) {
            this._animation = this.getComponent(dragonBones.ArmatureDisplay)
        }
        this._showTime = KUN.GameStatus.showTime
        this._ctrl = ctrl
    },

    addClipByList(clipNameList) {
        if(clipNameList.length <= 0) return
        this._anima = this.node.getComponent(cc.Animation)
        if(this._anima) {
            this._isPlayNativeAnimaFlag = true
            return
        }
        this._anima = this.node.addComponent(cc.Animation)
        this._isPlayNativeAnimaFlag = true
        clipNameList.forEach(element => {
            cc.loader.loadRes('clip/'+element,cc.AnimationClip,(err,clip)=>{
                this._anima.addClip(clip)
            })
        });
    },

    playNativeAnima(name,startTime = 0,callback) {
        if(!this._isPlayNativeAnimaFlag) return
        // playAdditive 
        let status = this._anima.play(name,startTime)
        this._anima.on('finished',callback)
        // pause   resume  stop
        // setCurrentTime  set current animation time
        // animtaion status  //////  name speed  duration  repeatCount  wrapMode  isPlaying  isPaused  frameRate
        // cc.WrapMode Infinity

        // animation event
        // start  pause  stop  resume  lastframe  finished
        // getAnimationState //// to simple clip set aniamiton event
    },

    // float
    showy() {
        if(!this._isUserDragonBones) {
            let upDownData = 5
            let showyTime = 1
            this.node.runAction(cc.repeatForever(
                cc.sequence(
                    cc.moveBy(showyTime,cc.p(0,upDownData)),
                    cc.moveBy(showyTime,cc.p(0,-upDownData*2)),
                    cc.moveBy(showyTime,cc.p(0,upDownData))
                )
            ))
        } else {
            this.playAnima('tun',0,0.1)
        }
    },

    playAnima(name_, playTimes, timeScale, completeCallback) {
        if(!this._isUserDragonBones) return
        this._animation.timeScale = timeScale
        this._animation.playAnimation(name_,playTimes)
        this._animation.addEventListener(dragonBones.EventObject.COMPLETE,completeCallback)
    }
});