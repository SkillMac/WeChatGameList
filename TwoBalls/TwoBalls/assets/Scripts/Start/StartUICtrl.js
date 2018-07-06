
let _res_cache = require('ResCache')
let GameTools = require('GameTools')
cc.Class({
    extends: cc.Component,

    properties: {
        tipsLable: cc.Label,
        panelBg: cc.Sprite,
    },

    onLoad () {
        this.initData();
        this.init()
        this.initClickEvent()
    },

    initData () {
        this._preLoadResFlag = true;
        this._btnList = [];
    },

    init() {
        if(cc.TB === undefined || cc.TB === null) {
            this.preload()
        }
    },

    preload () {
        //this.showProgress()
        // 预加载字段 赋值为false
        this._preLoadResFlag = false;
        //加入提示信息
        this.setTipsMsg('zyjah...')
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
                // this.setTipsMsg('资源加载完成')
                this.loadComplete()
                this.hideTipsMsg()
                // 资源预加载成功
                this.node.stopAllActions()
                // 数据初始化 微信登录
                this.initOnceData()
            }
        }))));

        cc.loader.loadRes('audio/broke1')
    },

    initOnceData () {
        // 游戏开始只初始化一次
        // 游戏开始时的数据初始化工作
        cc.TB = {}
        cc.TB.GAME = require('gameStatus')
        let WCO = require('weChat')
        cc.TB.GAME.firstEnterGameFlag = false
        // 绑定显示群排行的函数
        WCO.registerOnGroupShareFunc((ticket) => {
            this.onGroupShare(ticket)
        });
        cc.TB.wco = new WCO()
        let wco = cc.TB.wco
        // 微信登录
        wco.checkIsLogin()
        GameTools.httpGet('/test.php',{
            type:1,
        },res=>{
            console.log('开始界面',res)
        })
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
        this._btnList.push(startBtn)

        let rankBtn = this.node.getChildByName('kingBtn')
        rankBtn.on('click', this.rankBtnEvent, this)
        this._btnList.push(rankBtn)

        let groupBtn = this.node.getChildByName('shareBtn')
        groupBtn.on('click', this.groupShare, this)
        this._btnList.push(groupBtn)

        let taskBtn = this.node.getChildByName('taskBtn')
        taskBtn.on('click', this.taskBtnEvent, this)
        this._btnList.push(taskBtn)

        let urgeBtn = this.node.getChildByName('urgeBtn')
        urgeBtn.getComponent('urgeEffect').show1()
        urgeBtn.on('click', this.urgeBtnEvent, this)
        this._btnList.push(urgeBtn)

        if(!cc.TB || !cc.TB.GAME || cc.TB.GAME.firstEnterGameFlag) {
            this.hideAllBtn()
        }
        else {
            //this.bar.parent.active = false
        }
    },

    startBtnVent(event) {
        cc.TB.GAME.initStartData()
        // this.node.dispatchEvent(new cc.Event.EventCustom("start_game_btn",true));
        this.node.runAction(cc.sequence(cc.fadeOut(0.35),cc.callFunc(()=>{
            // 跳转游戏场景
            cc.TB.GAME.isPlaying = true
            cc.director.loadScene('MainGame',()=>{
                // console.log('游戏主场景跳转成功')
            });
        })));
    },

    rankBtnEvent(event) {
        let self = this
        this.panelShow()
        cc.loader.loadRes("prefab/rank", cc.Prefab, function(err, prefab){
            self.hideTipsMsg()
            let node = cc.instantiate(prefab)
            node.getComponent('rankCtrl').init(()=>{
                self.onOffPanelEvet()
            });
            self.node.parent.addChild(node)
        });
    },

    groupShare(event) {
        cc.TB.wco.groupShare('share')
    },

    taskBtnEvent(event) {
        this.panelShow()
        cc.loader.loadRes("prefab/panel1", cc.Prefab, (err, prefab)=>{
            this.hideTipsMsg()
            let node = cc.instantiate(prefab)
            node.getComponent('PanelCtrl').init({
                hide_panel_func: ()=>{
                    this.onOffPanelEvet()
                },
            })
            this.node.parent.addChild(node)
        });
    },

    urgeBtnEvent(event) {
        this.panelShow()
        cc.loader.loadRes("prefab/panel2", cc.Prefab, (err, prefab)=>{
            this.hideTipsMsg()
            let node = cc.instantiate(prefab)
            node.getComponent('PanelCtrl').init({
                hide_panel_func: ()=>{
                    this.onOffPanelEvet()
                },
                urge_func: ()=>{
                    this.startBtnVent()
                }
            })
            this.node.parent.addChild(node)
        });
    },

    setTipsMsg (msg) {
        this.tipsLable.string = msg
    },

    hideTipsMsg() {
        this.tipsLable.node.runAction(cc.sequence(cc.fadeOut(0.35),cc.hide()))
    },

    showTipsMsg() {
        this.tipsLable.node.opacity = 255
        this.tipsLable.node.active = true
    },

    panelShow() {
        this.panelBg.node.active = true
        this.showTipsMsg()
        this.setTipsMsg('jah...')
    },

    panelHide() {
        this.panelBg.node.active = false
    },

    onGroupShare(shareTicket) {
        // 群排行榜
        let self = this;
        this.panelShow()
        cc.loader.loadRes("prefab/rank", cc.Prefab, function(err, prefab){
            self.hideTipsMsg()
            let prefabNode = cc.instantiate(prefab);
            prefabNode.getComponent('rankCtrl').init(()=>{
                self.onOffPanelEvet()
            });
            prefabNode.getComponent('rankCtrl').showGroupPic();
            self.node.parent.addChild(prefabNode);
            GameTools.sendMessage({
                type: GameTools.msgType.groupShare,
                ticket: shareTicket,
                key: cc.TB.GAME.weChatData.keyList[0],
            });
        });
    },

    onOffPanelEvet() {
        this.panelHide()
    },

    hideAllBtn() {
        this._btnList.forEach(element => {
            element.active = false
            element.opacity = 0
        });
    },

    showAllBtn() {
        this._btnList.forEach(element => {
            element.active = true
            element.runAction(cc.fadeIn(0.35))
        });
    },

    loadComplete() {
        this.showAllBtn()
    },
});
