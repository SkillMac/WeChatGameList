cc.Class({
    extends: cc.Component,

    properties: {
        itemList: [cc.SpriteFrame], //you want to show elements
        mask: cc.Node, // you must define yourself mask node
    },

    // In order to ensure the correct initialization sequence.
    init() {
        // init must local data
        this.initData()
        // keep per item size
        this.keepItemSize()
        // create Content Node and sort itemList by item width
        this.initElemet()
        // move to default page index
        this.moveDefaultPageIndex()
        // bding touch event
        this.bdingTouchEvent()
    },

    initData() {
        this._itemListSize = []
        this._content = null
        this._initItemCounts = 3
        this._itemScale = 0.7
        this._curIndex = 0
        this._minIndex = 0
        this._maxIndex = this.itemList.length - 1
        this._startPosX = 0
        this._endPosX = 0
        this._minSlideDis = 50
        this._slideTime = 0.5
        this._isSliding = false
        this._endCallFunc = null
        this._startCallFunc = null
        this._curExsitsIndexList = [-1,0,1]
    },

    moveDefaultPageIndex() {
        // this.setCurIndex()
        this._content.x = -this._content.getChildByName(this._curIndex.toString()).x
    },

    bdingTouchEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchEventStart, this)
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchEventMove, this)
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEventEnd, this)
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchEventCancel, this)
    },

    /*
    * TOUCH EVENT API
    * getDelta
    * getLocation
    * getID // avoid mutile point touch
    * touch // get current bding touch event obj
    */

    touchEventStart(e) {
        e.stopPropagation()
        if(this._isSliding) return
        this._startPosX = e.getLocationX()
        this.node.emit('page-view-start')
    },

    touchEventMove(e) {
        e.stopPropagation()
        if(this._isSliding) return
        let dt = e.getDelta()
        this._content.x += dt.x
    },

    touchEventEnd(e) {
        e.stopPropagation()
        if(this._isSliding) return
        this._endPosX = e.getLocationX()
        if(Math.abs(this._endPosX - this._startPosX) >= this._minSlideDis) {
            let tarIndex = this._endPosX - this._startPosX < 0 ? this.getNextIndex() : this.getLastIndex()
            if(tarIndex == this.getCurIndex()) {
                this.setCurIndex(this.getCurIndex())
            } else {
                this.setCurIndex(tarIndex,true)
            }
        } else {
            this.setCurIndex(this.getCurIndex())
        }
    },

    touchEventCancel(e) {
        e.stopPropagation()
        if(this._isSliding) return
        this._endPosX = e.getLocationX()
        if(Math.abs(this._endPosX - this._startPosX) >= this._minSlideDis) {
            let tarIndex = this._endPosX - this._startPosX < 0 ? this.getNextIndex() : this.getLastIndex()
            if(tarIndex == this.getCurIndex()) {
                this.setCurIndex(this.getCurIndex())
            } else {
                this.setCurIndex(tarIndex,true)
            }
        } else {
            this.setCurIndex(this.getCurIndex())
        }
    },

    keepItemSize() {
        this.itemList.forEach(element => {
            this._itemListSize.push(element._originalSize)
        });
    },

    initElemet() {
        let node_ = new cc.Node()
        this._content = node_
        node_.anchorX = 0
        node_.setName('content')
        node_.x = 0
        node_.y = 0
        this.mask.addChild(node_)

        for (let i = 0; i < this._initItemCounts; i++) {
            node_.addChild(this._createItem(i))
        }
    },

    _createItem(index) {
        let node_ = new cc.Node()
        node_.setName(index.toString())
        let sprite_ = node_.addComponent(cc.Sprite)
        sprite_.spriteFrame = this.itemList[index]
        node_.setScale(this._itemScale)
        let lastPosX_ = index - 1 >= 0 ? this._content.getChildByName((index-1).toString()).x : 0
        let posX_ = index - 1 >= 0 ? lastPosX_ + ((this._itemListSize[index-1].width / 2) + (this._itemListSize[index-1].width / 2)) : 0
        node_.setPosition(posX_,0)
        return node_
    },

    getContentChild(index) {
        return this._content.getChildByName(index.toString())
    },

    changeItem(dir) {
        if((this.getCurIndex() == (this._minIndex + 1) && dir > 0) || (this.getCurIndex() == (this._maxIndex - 1) && dir < 0)) {
            // to do
        } else {
            if(dir > 0) {
                if(this.getContentChild(this.getNextIndex())) return
                let old_ = this.getContentChild(this.getLastIndex() - 1)
                old_.setName(this.getNextIndex().toString())
                old_.getComponent(cc.Sprite).spriteFrame = this.itemList[this.getNextIndex()]
                old_.x = this.getContentChild(this.getCurIndex()).x + this._itemListSize[this.getCurIndex()].width / 2 + this._itemListSize[this.getNextIndex()].width / 2
            } else if(dir < 0) {
                if(this.getContentChild(this.getLastIndex())) return
                let old_ = this.getContentChild(this.getNextIndex() + 1)
                old_.setName(this.getLastIndex().toString())
                old_.getComponent(cc.Sprite).spriteFrame = this.itemList[this.getLastIndex()]
                old_.x = this.getContentChild(this.getCurIndex()).x - (this._itemListSize[this.getCurIndex()].width / 2 + this._itemListSize[this.getLastIndex()].width / 2)
            }
        }
    },


    // public funciton
    getCurIndex() {
        return this._curIndex
    },

    getLastIndex() {
        let res = this._curIndex - 1 >= 0 ? this._curIndex - 1 : 0
        return res
    },

    getNextIndex() {
        let res = this._curIndex + 1 <= this._maxIndex ? this._curIndex + 1 : this._maxIndex
        return res
    },

    getMaxIndex() {
        return this._maxIndex
    },

    getMinIndex() {
        return this._minIndex
    },

    setCurIndex(index, isFade=false) {
        let node_ = this._content.getChildByName(index.toString())
        let tarPosX = -this._content.getChildByName(index.toString()).x
        let dir = 0
        if(this.getCurIndex() < index) {
            dir = 1
        } else if(this.getCurIndex() > index) {
            dir = -1
        }
        let changeItemFunc = ()=>{
            this.changeItem(dir)
        }
        if(isFade) {
            this._isSliding = true
            this._content.runAction(cc.sequence(cc.moveTo(this._slideTime,cc.p(tarPosX,this._content.y)),cc.callFunc(()=>{
                this._curIndex = index
                changeItemFunc()
                this.node.emit('page-view-end')
                this._isSliding = false
            })))
        } else {
            this._isSliding = true
            this._curIndex = index
            this._content.x = tarPosX
            changeItemFunc()
            this.node.emit('page-view-end')
            this._isSliding = false
        }
    },

    registerMoveStartFunc(func) {
        this._startCallFunc = func
    },

    registerMoveEndFunc(func) {
        this._endCallFunc = func
    },
});
