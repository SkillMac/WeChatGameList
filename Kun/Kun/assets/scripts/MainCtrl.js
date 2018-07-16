
cc.Class({
    extends: cc.Component,

    properties: {
        camera: cc.Camera,
        hbPanel: cc.Prefab,
    },

    onLoad() {
        this.init()
        
        this._birthCtrl = this.node.getChildByName('Birth').getComponent('BirthCtrl')
        this._birthCtrl.init(this)

        this._playerCtrl = this.node.getChildByName('Player').getComponent('Player')
        this._playerCtrl.init(this)

        this._touchCtrl = this.node.getChildByName('TouchNode').getComponent('TouchEvent')
        this._touchCtrl.init(this)

        this._effect1Ctrl = this.node.getChildByName('CloudParticle').getComponent('Common')

        this._userInfoCtrl = this.node.getChildByName('UserInfo').getComponent('UserInfo')
        this._userInfoCtrl.init(this)

        this._mappingCtrl = this.node.getChildByName('Mapping').getComponent('Mapping')
        this._mappingCtrl.init(this,KUN.UserData.getFishPrice())

        this.initData()
    },

    init(){
        KUN.UserData.setUserData(KUN.Server.getUserInfo())
        KUN.UserData.setFishPrice(KUN.Server.getFishPrice())
    },

    initData() {
        this._goldPos = this.node.getChildByName('GoldPos').getPosition()
    },

    zoomOut() {
        // this.camera.zoomRatio = 2.9
    },

    zoomIn() {

    },

    // ==== enmey module ====

    buildNewFish() {
        // effect
        this._effect1Ctrl.show1()

        this.setBgSpeedMul(KUN.GameStatus.target_speed_mul)
        let data = KUN.Server.getEnemyData()
        // adjust data with player data
        let player_data = this._playerCtrl.getData()
        data.player_data = player_data
        this._birthCtrl.buildNewFish(data)
        // tell player open mouth
        this._playerCtrl.openMouth()
    },

    touchEndEvent() {
        this.updataData()
        this.buildNewFish()
    },

    updataData() {
        if(KUN.Server.checkIsCanPlay()) {
            this.chageMemData()
            this._userInfoCtrl.touchOnce()
        } else {
            // 能量不足
        }
    },

    chageMemData() {
        KUN.Server.touchOnce()
    },

    setBgSpeedMul(mul) {
        KUN.GameStatus.speed_mul = mul
    },

    startEat() {
        this.changeGameStatus(1)
    },

    finishEatBefore() {
        this.setBgSpeedMul(1)
        this._playerCtrl.collectGold(this._goldPos)
    },

    finishEat() {
        // change user info coin data
        this._userInfoCtrl.updateCoin()
        this.changeGameStatus(2)
    },

    changeGameStatus(index) {
        KUN.GameStatus.status = KUN.GameStatus.statusList[index]
    },

    checkCanTouch() {
        if(KUN.GameStatus.status == KUN.GameStatus.statusList[2]) {
            return true
        } else {
            return false
        }
    },

    showNoEnergyPanel(e,p) {
        let node_ = cc.instantiate(this.hbPanel)
        node_.getComponent('HPPanel').init(this)
        this.node.addChild(node_)
    },

    purchaseNewFish(price, callback) {
        if(KUN.Server.purchaseNewFish(price)) {
            // update new fish skin

            // update user visible data
            this._userInfoCtrl.updateCoin()
            this._userInfoCtrl.updateLevel()
            // call back map func
            callback({status:'ok'})
        } else {
            callback({status:'-1'})
        }
    }
});
