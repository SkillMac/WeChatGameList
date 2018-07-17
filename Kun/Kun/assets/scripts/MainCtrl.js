
cc.Class({
    extends: cc.Component,

    properties: {
        camera: cc.Camera,
        hbPanel: cc.Prefab,
        tipsPanel: cc.Prefab,
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

    update(dt) {
        this.zoomOut()
    },

    init(){
        this._zoom = 3
        let data = KUN.Server.getUserInfo()
        this._zoom = data.zoom
        this._zoom_dt = data.zoom_dt
        KUN.UserData.setUserData(data)
        KUN.UserData.setFishPrice(KUN.Server.getFishPrice())

        // 初始化镜头
        this.camera.zoomRatio = this._zoom
    },

    initData() {
        this._goldPos = this.node.getChildByName('GoldPos').getPosition()
        this._purchaseEnergyPanelFlag = false
        this._tipsPanelFlag = false
        this._zoomOutFlag = false
    },

    zoomOut() {
        if(!this._zoomOutFlag) return
        let tar = this._zoom
        let n = 0
        n = cc.lerp(this.camera.zoomRatio,tar,0.1)
        if(n-tar <= 0.01) {
            n = tar
            this._zoomOutFlag = false
        }
        this.camera.zoomRatio = n
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
        if(KUN.Server.checkIsCanPlay()) {
            this.updataData()
            this.buildNewFish()
        } else {
            this.showNoEnergyPanel()
        }
    },

    updataData() {
        this.chageMemData()
        this._userInfoCtrl.touchOnce()
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
        if(!this._purchaseEnergyPanelFlag) {
            this._purchaseEnergyPanelFlag = true
            let node_ = cc.instantiate(this.hbPanel)
            node_.getComponent('HPPanel').init(this,()=>{
                this._purchaseEnergyPanelFlag = false
            }).showDialog()
            this.node.addChild(node_)
        }
    },

    purchaseNewFish(price, callback) {
        if(KUN.Server.purchaseNewFish(price)) {
            // update new fish skin
            this._playerCtrl.changeFishSkin()
            // update user visible data
            this._userInfoCtrl.updateCoin()
            this._userInfoCtrl.updateLevel()
            // call back map func
            callback({status:'ok'})
            this.showTipsPanel('购买成功，赶快去玩耍吧！',true)
        } else {
            callback({status:'-1'})
            this.showTipsPanel()
        }
    },

    showTipsPanel(tips,isAutoHidePanel) {
        if(this._tipsPanelFlag) return
        this._tipsPanelFlag = true
        let node_ = cc.instantiate(this.tipsPanel)
        let t = 0
        node_.getComponent('TipsPanel').init(this,()=>{
            this._tipsPanelFlag = false
            if(isAutoHidePanel) {
                t = this._mappingCtrl.showOrHied()
                this.node.runAction(cc.sequence(cc.delayTime(t),cc.callFunc(()=>{
                    this._zoom -= this._zoom_dt
                    this._zoomOutFlag = true
                })))
            }
        }).showDialog()
        this.node.addChild(node_)        
        if(tips) {
            node_.getChildByName('tips').getComponent(cc.Label).string = tips;
        }
    },
});
