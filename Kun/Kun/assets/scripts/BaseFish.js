
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(ctrl) {
        this.showy()
        this._showTime = KUN.GameStatus.showTime
        this._ctrl = ctrl
    },

    // float
    showy() {
        let upDownData = 5
        let showyTime = 1
        this.node.runAction(cc.repeatForever(
            cc.sequence(
                cc.moveBy(showyTime,cc.p(0,upDownData)),
                cc.moveBy(showyTime,cc.p(0,-upDownData*2)),
                cc.moveBy(showyTime,cc.p(0,upDownData))
            )
        ))
    }
});