import BasePanel from "BasePanel";

cc.Class({
    extends: BasePanel,

    properties: {
        rankView: cc.Sprite,
    },

    init () {
        if (CC_WECHATGAME) {
            this.tex = new cc.Texture2D()
            window.sharedCanvas.width = 1280
            window.sharedCanvas.height = 720
            this.onSlideRankEvent()
        }
        KUN.GameTools.sendMessage({
            type: KUN.GameStatus.msgType.updateRank,
            keyList:[KUN.GameStatus.levelKeyList[0]],
        });

        this._endFunc = ()=>{
            KUN.GameStatus.status = KUN.GameStatus.statusList[2]
        }
    },

    update (dt) {
        this._updateSubDomainCanvas()
    },

    _updateSubDomainCanvas() {
        if (CC_WECHATGAME) {
            if (window.sharedCanvas != undefined) {
                this.tex.initWithElement(window.sharedCanvas)
                this.tex.handleLoadedTexture()
                this.rankView.spriteFrame = new cc.SpriteFrame(this.tex)
            }
        }
    },

    onSlideRankEvent() {
        this.node.on('touchmove',(event)=>{
            KUN.GameTools.sendMessage({
                type: KUN.GameStatus.msgType.slideRank,
                y: event.getDelta().y,
                isHitRank: false,
            })
        })
    }
});
