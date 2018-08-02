
cc.Class({
    extends: cc.Component,

    properties: {
        l1Prefab: [cc.Prefab],
        l2Prefab: [cc.Prefab],
        l3Prefab: [cc.Prefab],
        c1Prefab: [cc.Prefab],
        c2Prefab: [cc.Prefab],
        birthPos: [cc.Node],
        enemyPos: cc.Node,
        enemyPosFront: cc.Node,
    },

    init(ctrl) {
        this._ctrl = ctrl
        this.initData()
        this.initPrefabList()
        this.buildAction()
    },

    initData() {
        this._objList = []
        for (let i = 0; i < 5; i++) {
            this._objList.push([])  
        }
        this._prefabList = []
        this._prefabList.push(this.l1Prefab)
        this._prefabList.push(this.c1Prefab)
        this._prefabList.push(this.l2Prefab)
        this._prefabList.push(this.c2Prefab)
        this._prefabList.push(this.l3Prefab)
        // this._tex = null
    },

    initPrefabList() {
        let i = 0
        this.birthPos.forEach(item => {
            item.getChildren().forEach(child => {
                this.playUseableChild(i,true,child)
            });
            i++
        });
    },

    checkIsUse(item) {
        return !(item.getIsUsing())
    },

    collectChild(i, child) {
        // #105 fix code 
        this._objList[i].unshift(child)
        this.playUseableChild(i)
    },

    getUseableChild(index) {
        let item = this._objList[index].pop()
        if(item && this.checkIsUse(item)) {
            return item
        } else {
            // instantiate game obj
            // cc.instantiate
            let randomData = Math.round((this._prefabList[index].length-1) * cc.random0To1())
            let node_ = cc.instantiate(this._prefabList[index][randomData])
            this.birthPos[index].addChild(node_)
            return (node_.getComponent('NoActionList'))
        }
    },

    playUseableChild(index, isStartGame, child) {
        if(isStartGame) {
            child.getComponent('NoActionList').init(KUN.GameStatus.speedList[index], obj=>{
                this.collectChild(index,obj)
            })
        } else {
            let item = this.getUseableChild(index)
            item.node.x = -1280
            item.init(KUN.GameStatus.speedList[index], obj=>{
                this.collectChild(index,obj)
            })
        }
    },

    buildAction() {
        for (let i = 0; i < 5; i++) {
            this.playUseableChild(i)
        }
    },

    buildNewFish(data) {
        cc.loader.loadRes(cc.js.formatStr('prefab/Enemy%d',data.type),cc.Prefab,(err,pfb)=>{
            if(err) return
            let node_ = cc.instantiate(pfb)
            // let head_ = this.buildHead(data.headUrl,node_)
            let enmeyCtrl = node_.getComponent('Enemy').init(data,this._ctrl)

            if(data.flag == 'eaten') {
                this.enemyPosFront.addChild(node_)
            } else {
                this.enemyPos.addChild(node_)
            }
        })
    },
});
