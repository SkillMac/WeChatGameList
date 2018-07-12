import BaseFish from "BaseFish";

cc.Class({
    extends: BaseFish,

    properties: {
        
    },

    init(data) {
        this._super()
        this.adjustByData(data)
        return this
    },

    adjustByData(data) {
        // change skin
        KUN.ResCache.setSpriteFrame(this.getComponent(cc.Sprite),'fish/yu'+data.type)
        // change scale
        let mul = data.level / data.player_data.level
        let v = mul * data.player_data.size
        this.node.setScale(v)
    },

    runToPlayer() {
        this.node.runAction(cc.sequence(cc.moveTo(this._showTime,cc.p(0,0)),cc.callFunc(()=>{
            this.node.destroy()
        })))
    }
});
