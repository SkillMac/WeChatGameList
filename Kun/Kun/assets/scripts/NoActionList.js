
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(index ,speed, birthCtrl) {
        this._speedX = speed
        this._maxMoveX = 0.02 * this._speedX
        this._using = true
        this._birthCtrl = birthCtrl
        this.node.active = true
        this._index = index
    },

    update(dt) {
        let curMoveX = dt * this._speedX * KUN.GameStatus.speed_mul
        let maxMoveX = this._maxMoveX * KUN.GameStatus.speed_mul
        this.node.x += maxMoveX < curMoveX ? maxMoveX : curMoveX
        this.isOutScreen()
    },

    setSpeed(speed) {
        this._speedX = speed
    },

    getSpeed() {
        return this._speedX
    },

    setUsingFlag(f) {
        this._using = f
    },

    isOutScreen() {
        let dis = this.node.x - Math.abs(this.node.scaleX) * this.node.width / 2
        if(dis > 700) {
            this.setSpeed(0)
            this.node.active = false
            this.setUsingFlag(false)
            // tell birth ctrl collect
            this._birthCtrl.collectChild(this._index, this)
        }
    },

    getIsUsing() {

    }
});
