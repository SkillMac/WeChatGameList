
cc.Class({
    extends: cc.Component,

    properties: {
        l1Prefab: [cc.Prefab],
        l2Prefab: [cc.Prefab],
        l3Prefab: [cc.Prefab],
        c1Prefab: [cc.Prefab],
        c2Prefab: [cc.Prefab],
        birthPos: [cc.Node],
    },

    init() {
        this.initData()
        this.initPrefabList()
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
    },

    getUseableChild(index) {
        let item = this._objList.pop()
        if(item && this.checkIsUse(item)) {
            return item
        } else {
            // instantiate game obj
            // cc.instantiate
            let node_ = cc.instantiate(this._prefabList[index])
            this.birthPos[index].addChild(node_)
            return node_
        }
    },

    playUseableChild(index, isStartGame, child) {
        if(isStartGame) {
            child.getComponent('NoActionList').init(index, KUN.GameStatus.speedList[index], true)
        } else {
            let item = this.getUseableChild(index)
            item.init(index, KUN.GameStatus.speedList[index], this)
        }
    },
});
