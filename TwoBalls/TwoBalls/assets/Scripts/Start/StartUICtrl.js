
let _res_cache = require('ResCache')
cc.Class({
    extends: cc.Component,

    properties: {
        tipsLable: cc.Label,
    },

    onLoad () {
        this.initData();
        this.init()
        this.initClickEvent()
    },

    initData () {
        this._preLoadResFlag = true;
    },

    init() {
        if(cc.TB === undefined || cc.TB === null) {
            this.preload()
        }
    },

    preload () {
        // 预加载字段 赋值为false
        this._preLoadResFlag = false;
        //加入提示信息
        this.setTipsMsg('资源加载中...')
        //////////// 资源预加载阶段 /////////////
        let gameSceneFlag = false
        let enemyResFalg = false
        // 游戏场景加载
        this.preLoadGameScene(()=>{
            gameSceneFlag = true
        });
        // 敌人资源加载
        _res_cache.preload(()=>{
            cc.resCache = _res_cache
            enemyResFalg = true
        });

        let _loadResSuccessFlag = false

        this.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(0.1),cc.callFunc(()=>{
            if (gameSceneFlag && enemyResFalg && !_loadResSuccessFlag) {
                _loadResSuccessFlag = true
                // 资源加载完成信息显示
                this.setTipsMsg('资源加载完成')
                this.tipsLable.node.runAction(cc.sequence(cc.fadeOut(0.35),cc.hide()))
                // 资源预加载成功
                this.node.stopAllActions()
                // 数据初始化 微信登录
                this.initOnceData()
            }
        }))));
    },

    initOnceData () {
        // 游戏开始只初始化一次
        // 游戏开始时的数据初始化工作
        cc.TB = {}
        cc.TB.GAME = require('gameStatus')
        let WCO = require('weChat')
        // 绑定显示群排行的函数
        WCO.registerOnGroupShareFunc((ticket) => {
            this.onGroupShare(ticket)
        });
        cc.TB.wco = new WCO()
        let wco = cc.TB.wco
        // 微信登录
        wco.checkIsLogin()
    },

    preLoadGameScene(callFunc) {
        cc.director.preloadScene('MainGame',(err)=>{
            if(callFunc) {
                callFunc()
            };
        });
    },

    initClickEvent() {
        let startBtn = this.node.getChildByName('startBtn')
        startBtn.on('click', this.startBtnVent, this)

        let rankBtn = this.node.getChildByName('kingBtn')
        rankBtn.on('click', this.rankBtnEvent, this)

        let groupBtn = this.node.getChildByName('shareBtn')
        groupBtn.on('click', this.groupShare, this)

        let taskBtn = this.node.getChildByName('taskBtn')
        taskBtn.on('click', this.taskBtnEvent, this)
    },

    startBtnVent(event) {
        cc.TB.GAME.score = 0
        cc.TB.GAME.checkPoint = 0
        // this.node.dispatchEvent(new cc.Event.EventCustom("start_game_btn",true));
        this.node.runAction(cc.sequence(cc.fadeOut(0.35),cc.callFunc(()=>{
            // 跳转游戏场景
            cc.TB.GAME.isPlaying = true
            cc.director.loadScene('MainGame',()=>{
                console.log('游戏主场景跳转成功')
            });
        })));
    },

    rankBtnEvent(event) {
        let self = this
        cc.loader.loadRes("prefab/rank", cc.Prefab, function(err, prefab){
            let node = cc.instantiate(prefab)
            self.node.parent.addChild(node)
        });
    },

    groupShare(event) {
        cc.TB.wco.groupShare('share')
    },

    taskBtnEvent(event) {
        cc.loader.loadRes("prefab/panel1", cc.Prefab, (err, prefab)=>{
            let node = cc.instantiate(prefab)
            this.node.parent.addChild(node)
        });
    },

    setTipsMsg (msg) {
        this.tipsLable.string = msg
    }
});
