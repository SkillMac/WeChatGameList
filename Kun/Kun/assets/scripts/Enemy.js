import BaseFish from "BaseFish";

cc.Class({
    extends: BaseFish,

    properties: {
        
    },

    init(data,ctrl) {
        this._super(ctrl)
        this.adjustByData(data)
        return this
    },

    adjustByData(data) {
        // change skin
        KUN.ResCache.setSpriteFrame(this.getComponent(cc.Sprite),'fish/yu'+data.type)
        // change scale
        let mul = data.level / data.player_data.level * 1.5
        let v = mul * data.player_data.size
        this.node.setScale(v)
        this.node.y = data.player_data.tarPos.y
        this.runToPlayer(data.player_data.tarPos)
    },

    runToPlayer(pos) {
        this.node.runAction(cc.sequence(cc.moveTo(this._showTime,cc.p(pos.x,pos.y)),cc.callFunc(()=>{
            this.node.destroy()
        })))
    }
});
