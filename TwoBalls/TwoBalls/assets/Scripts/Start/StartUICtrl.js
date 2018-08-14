
let _res_cache = require('ResCache')
let GameTools = require('GameTools')
cc.TB = {}
cc.TB.GAME = require('gameStatus')
let WCO = require('weChat')

cc.Class({
    extends: cc.Component,

    properties: {
        tipsLable: cc.Label,
        panelBg: cc.Sprite,
        loading: cc.Node,
        loadingSp: cc.SpriteFrame,
        urgeNode: cc.Node,
    },

    onLoad () {
        // 微信小游戏检测更新
        WCO.checkNewVersion()
        this.initData();
        this.init()
        this.initClickEvent()
    },

    initData () {
        this._preLoadResFlag = true;
        this._btnList = [];
        GameTools.httpGet('/PanelCfg.php',{
            type:1,
            version : cc.TB.GAME.version,
        },res=>{
            if(res == '-1') {
                // 请检查检查网络
                WCO.showTips('请检查网络')
                return
            }
            else if(res == '-2') {
                // 网络连接超时
                WCO.showTips('网络连接超时')
                return
            }
            let cfg = JSON.parse(res)
            cc.TB.GAME.panelCfg = cfg
            if(GameTools.isShowPanelByServer('urge_money')) {
                cc.loader.loadRes('prefab/urgeBtn', cc.Prefab, (err, prefab)=>{
                    if(err) return
                    let node = cc.instantiate(prefab)
                    node.getComponent('urgeEffect').show1()
                    node.on('click', this.urgeBtnEvent, this)
                    let widget = node.addComponent(cc.Widget)
                    this.node.addChild(node)
                    widget.isAlignLeft = true
                    widget.left = -340
                    widget.updateAlignment()
                    node.y = 0
                })
            }
        })
    },

    init() {
        if(!cc.TB.GAME.completeResFlag) {
            this.preload()
        }
    },

    getLoadingNode() {
        let node = new cc.Node()
        let widget = node.addComponent(cc.Widget)
        widget.isAlignTop = true
        widget.top = 0
        widget.isAlignBottom = true
        widget.bottom = 0
        widget.isAlignLeft = true
        widget.left = 0
        widget.isAlignRight = true
        widget.right = 0
        widget.isAlignOnce = true
        let sprite = node.addComponent(cc.Sprite)
        sprite.spriteFrame = this.loadingSp
        // widget.updateAlignment()
        return node
    },

    preload () {
        // console.log
        this.loading.addChild(this.getLoadingNode())
        this.loading.runAction(cc.sequence(cc.delayTime(2),cc.callFunc(()=>{
            if(this.loading) {
                this.loading.destroy()
            }
        })))
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
        gameSceneFlag = true
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
        cc.TB.GAME.firstEnterGameFlag = false
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
        let offPanel = false
        this.panelShow()
        cc.TB.GAME.panelBgDestroyFunc = ()=> {
            offPanel = true
            this.hideTipsMsg()
            this.onOffPanelEvet()
        }
        cc.loader.loadRes("prefab/rank", cc.Prefab, function(err, prefab){
            if(err || offPanel) return
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
        if(!(GameTools.isShowPanelByServer('taskPanel'))) return
        let offPanel = false
        this.panelShow()
        cc.TB.GAME.panelBgDestroyFunc = ()=> {
            offPanel = true
            this.hideTipsMsg()
            this.onOffPanelEvet()
        }
        cc.loader.loadRes("prefab/panel1", cc.Prefab, (err, prefab)=>{
            if(err || offPanel) return
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
        let offPanel = false
        this.panelShow()
        cc.TB.GAME.panelBgDestroyFunc = ()=> {
            offPanel = true
            this.hideTipsMsg()
            this.onOffPanelEvet()
        }
        cc.loader.loadRes("prefab/panel2", cc.Prefab, (err, prefab)=>{
            if(err || offPanel) return
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
            this.urgeNode.addChild(node)
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
        let offPanel = false
        this.panelShow()
        cc.TB.GAME.panelBgDestroyFunc = ()=> {
            offPanel = true
            this.hideTipsMsg()
            this.onOffPanelEvet()
        }
        cc.loader.loadRes("prefab/rank", cc.Prefab, function(err, prefab){
            if(err || offPanel) return
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
        cc.TB.GAME.completeResFlag = true
        this.showAllBtn()
    },

    pubMoreGame(e,p) {
        cc.TB.wco.moreGame()
    }
});
