
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(speed,outScreenFunc,isStartUp) {
        this._speedX = speed
        this._maxMoveX = 0.02 * this._speedX
        this._using = true
        this.node.active = true
        this._outScreenFunc = null
        this._outScreenFunc = outScreenFunc
        this._speedMul =  1
        this._dir = 1 // -1 | 0  |  1
        this._moveType = 'mountion'  // mountion  | other
        this._isStartUp = isStartUp
    },

    update(dt) {
        if(!this._isStartUp) return
        let curMoveX = dt * this._speedX * this.getCurSpeedMul()
        let maxMoveX = this._maxMoveX * this.getCurSpeedMul()
        this.node.x += this._dir * (maxMoveX < curMoveX ? maxMoveX : curMoveX)
        this.isOutScreen()
    },

    setSpeed(speed) {
        this._speedX = speed
    },

    getSpeed() {
        return this._speedX
    },

    setSpeedMul(mul) {
        this._speedMul = mul
    },

    getSpeedMul() {
        return this._speedMul
    },

    getDir() {
        return this._dir
    },

    setDir(dir_) {
        this._dir = dir_
    },

    getCurSpeedMul() {
        if(this._moveType == 'mountion') {
            return KUN.GameStatus.speed_mul
        } else {
            return this._speedMul
        }
    },

    setMoveType(type_) {
        this._moveType = type_
    },

    getMoveType() {
        return this._moveType
    },

    setUsingFlag(f) {
        this._using = f
    },

    getIsUsing() {
        return this._using
    },

    setOutScreenFunc(func) {
        this._outScreenFunc = func
    },

    isOutScreen() {
        let dis = 0
        if(this._dir < 0) {
            dis = this.node.x + Math.abs(this.node.scaleX) * this.node.width / 2
        } else if (this._dir > 0) {
            dis = this.node.x - Math.abs(this.node.scaleX) * this.node.width / 2
        }
        if((this._dir > 0 && dis > 700) ||(this._dir < 0 && dis < -700)) {
            this.setSpeed(0)
            this.node.active = false
            this.setUsingFlag(false)
            // tell birth ctrl collect
            if(this._outScreenFunc) {
                this._outScreenFunc(this)
            }
        }
    },    
});
