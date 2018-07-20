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
        if(data.flag == 'passBy') {
            data.player_data.tarPos.x = 1280
            data.player_data.size = -data.player_data.size
            if (data.level > data.player_data.level) {
                data.player_data.tarPos.y += 500
            } else {
                data.player_data.tarPos.y -= 300
            }
        } else if(data.flag == 'eaten') {
            this.node.x = 1280
            data.type += '_o'
        } else if(data.flag == 'eat') {
            
        } else if(data.flag == 'meet') {
            data.player_data.size = -data.player_data.size
            data.player_data.tarPos.x = 1280
        }
        // change skin
        KUN.ResCache.setSpriteFrame(this.getComponent(cc.Sprite),'fish/yu'+data.type)
        // change scale
        let mul = (data.level - data.player_data.level) * 1.5
        mul = mul == 0 ? 1 : mul
        if(data.level < data.player_data.level) {
            mul = 1 / mul
        }
        let v = mul * data.player_data.size
        console.log('倍数',v,mul,data.level,data.player_data.level)
        this.node.setScaleX(v)
        this.node.setScaleY(Math.abs(v))
        this.node.y = data.player_data.tarPos.y
        this.runToPlayer(data.player_data.tarPos)
    },

    runToPlayer(pos) {
        this.node.runAction(cc.sequence(cc.moveTo(this._showTime,cc.p(pos.x,pos.y)),cc.callFunc(()=>{
            this.node.destroy()
        })))
    }
});
