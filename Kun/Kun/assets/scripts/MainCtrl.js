
cc.Class({
    extends: cc.Component,

    properties: {
        camera: cc.Camera,
        hbPanel: cc.Prefab,
        tipsPanel: cc.Prefab,
        camera_u: cc.Node,
        player: cc.Node,
        energyTimer: cc.Node,
    },

    onLoad() {
        this.init()
        
        this._birthCtrl = this.node.getChildByName('Birth').getComponent('BirthCtrl')
        this._birthCtrl.init(this)

        this._playerCtrl = this.player.getComponent('Player')
        this._playerCtrl.init(this)

        this._touchCtrl = this.node.getChildByName('TouchNode').getComponent('TouchEvent')
        this._touchCtrl.init(this)

        this._effect1Ctrl = this.node.getChildByName('CloudParticle').getComponent('Common')

        this._userInfoCtrl = this.node.getChildByName('UserInfo').getComponent('UserInfo')
        this._userInfoCtrl.init(this)

        this._mappingCtrl = this.node.getChildByName('Mapping').getComponent('Mapping')
        this._mappingCtrl.init(this,KUN.UserData.getFishPrice())

        this._energyTimerCtrl = this.energyTimer.getComponent('Timer')

        this.initData()

        this.collectEnergy(true)
    },

    update(dt) {
        this.zoomInOut()
    },

    init(){
        this._zoom = 3
        let data = KUN.Server.getUserInfo()
        this._zoom = data.zoom
        this._zoom_dt = data.zoom_dt
        KUN.UserData.setUserData(data)
        KUN.UserData.setFishPrice(KUN.Server.getFishPrice())

        // 初始化镜头
        this.camera.zoomRatio = 2//this._zoom
    },

    initData() {
        this._purchaseEnergyPanelFlag = false
        this._tipsPanelFlag = false
        this._zoomOutFlag = false

        this._zoomOutFlag_u = false
        this._zoom_u = 1
    },

    zoomInOut() {
        if(!this._zoomOutFlag) return
        let tar = this._zoom
        let n = 0
        n = cc.lerp(this.camera.zoomRatio,tar,0.1)
        if(Math.abs(n-tar) <= 0.01) {
            n = tar
            this._zoomOutFlag = false
        }
        this.camera.zoomRatio = n
    },

    zoomInOut_u(callback,isIn) {
        // exp1
        // if(!this._zoomOutFlag_u) return
        // let tar = this._zoom_u
        // let n = 0
        // n = cc.lerp(this.camera_u.zoomRatio,tar,0.1)
        // if(Math.abs(n-tar) <= 0.01) {
        //     n = tar
        //     this._zoomOutFlag_u = false
        // }
        // this.camera_u.zoomRatio = n

        // exp 2
        // this.node.stopAllActions()
        // let tar = 0.5
        // let t = 0.35
        // if(isIn) {
        //     tar = 1
        // }
        // this.camera_u.runAction(cc.sequence(cc.scaleTo(t,tar),cc.callFunc(()=>{
        //     if(callback) callback()
        // })))
        return 0//t
    },

    // ==== enmey module ====

    buildNewFish() {
        // effect
        this._effect1Ctrl.show1()

        this.setBgSpeedMul(KUN.GameStatus.target_speed_mul)
        let data = KUN.Server.getEnemyData()
        // adjust data with player data
        let player_data = this._playerCtrl.getData()

        let delay = 0
        if(data.level> player_data.level) {
            // this._zoom_u = 0.4
            // this._zoomOutFlag_u = true
            delay = this.zoomInOut_u()
        }
        this.node.runAction(cc.sequence(cc.delayTime(delay),cc.callFunc(()=>{
            data.player_data = player_data
            this._birthCtrl.buildNewFish(data)
            // tell player open mouth
            this._playerCtrl.openMouth(data)
        })))
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
        this.collectEnergy()
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
        let goldPos = this.node.getChildByName('GoldPos').getPosition()
        this._playerCtrl.collectGold(goldPos)
    },

    finishEat() {
        // change user info coin data
        this._userInfoCtrl.updateCoin()
        KUN.Server.rFinishEat(()=>{
            this.changeGameStatus(2)
        })
        this.zoomInOut_u(null,true)
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
        KUN.Server.purchaseNewFish(price,res=>{
            if(res == '1'){
                // update new fish skin
                this._playerCtrl.changeFishSkin()
                // update user visible data
                this._userInfoCtrl.updateCoin()
                this._userInfoCtrl.updateLevel()
                // call back map func
                callback({status:'ok'})
                this.showTipsPanel('购买成功，赶快去玩耍吧！',true)
            } else if(res == '-1'){
                callback({status:'-1'})
                this.showTipsPanel()
            }
        })
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

    collectEnergy(isLogin){
        // console.log('登录累计的')
        if(KUN.UserData.getEnergy() < KUN.UserData.getMaxEnergy()){
            KUN.Server.rflockEnergy((res)=>{
                if(res.status == '1') {
                    this._energyTimerCtrl.init(res.time,()=>{
                        this.collectEnergy()
                    })
                } else if(res.status == '2') {
                    KUN.Server.updateUsrInfo()
                    if(isLogin){
                        this.showTipsPanel('离线累计' + res.add_energy + '个能量')
                    }
                    this._userInfoCtrl.updateEnergy()
                    this._energyTimerCtrl.hide()
                    if(KUN.UserData.getEnergy() < KUN.UserData.getMaxEnergy()){
                        this.collectEnergy()
                    }
                } else if(res == '-1') {
                    // to do 
                    this._energyTimerCtrl.hide()
                }
            })
        }
    },
});
