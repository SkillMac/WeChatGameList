
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(ctrl) {
        this.initData_p(ctrl)
        this.showy()
    },

    initData_p(ctrl) {
        this._isUserDragonBones = false
        if(this._isUserDragonBones) {
            this._animation = this.getComponent(dragonBones.ArmatureDisplay)
        }
        this._showTime = KUN.GameStatus.showTime
        this._ctrl = ctrl
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