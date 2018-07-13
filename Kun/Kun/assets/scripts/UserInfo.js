
cc.Class({
    extends: cc.Component,

    properties: {
        level: cc.Label,
        energy: cc.Label,
        coin: cc.Label,
    },

    init(ctrl) {
        this._ctrl = ctrl
        this._flag = true
        this._actionTime = 0.35
        this._dataCtrl = KUN.UserData

        this.initUserInfoData()
    },

    initUserInfoData() {
        this.updateCoin()
        this.updateEnergy()
        this.updateLevel()
    },

    // out
    showOrHide(e,p) {
        this._flag = !this._flag
        if(this._flag) {
            this.node.runAction(cc.moveBy(this._actionTime,cc.p(0,69)))
        } else {
            this.node.runAction(cc.moveBy(this._actionTime,cc.p(0,-69)))
        }
    },

    setLevel(level_) {
        this.level.string = level_
    },

    getLevel() {
        return this._dataCtrl.getLevel()
    },

    setCoin(coin_) {
        this.coin.string = coin_
    },

    getCoin() {
        return this._dataCtrl.getCoin()
    },

    setEnergy(energy_) {
        this.energy.string = energy_
    },

    getEnergy() {
        return this._dataCtrl.getEnergy()
    },

    msgEvent(e,p) {

    },

    soundEvent(e,p) {

    },

    rankEvent(e,p) {

    },

    purchase(type) {
        if(type == 'coin') {

        } else if(type == 'energy') {

        }
    },

    updateCoin() {
        this.setCoin(this.getCoin())
    },

    updateEnergy() {
        this.setEnergy(this.getEnergy())
    },

    updateLevel() {
        this.setLevel(this.getLevel())
    },

    touchOnce() {
        this.updateEnergy()
        this.updateLevel()
    }
});
