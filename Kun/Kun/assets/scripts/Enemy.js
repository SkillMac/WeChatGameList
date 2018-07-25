import BaseFish from "BaseFish";

cc.Class({
    extends: BaseFish,

    properties: {
        
    },

    init(data,ctrl) {
        // this.widthList = [0,1031,1186,1206,1230,1147]
        this.disList = [0,350,700,750]
        this._super(ctrl)
        this.adjustByData(data)
        return this
    },

    adjustByData(data) {

        data.player_data.size = data.flag == 'meet' ? -data.player_data.size : data.player_data.size

        // change scale
        let mul = Math.pow(1.5,data.level - data.player_data.level)
        let v = mul * data.player_data.size
        this.node.setScaleX(v)
        this.node.setScaleY(Math.abs(v))

        data.type = data.flag == 'eaten' ? data.type + '_o' : data.type
        KUN.ResCache.setSpriteFrame(this.getComponent(cc.Sprite),'fish/yu'+data.type)
        if(data.flag == 'passBy') {
            data.player_data.tarPos.x = 640 + (this.getWidth() * this.node.scaleX) / 2
            // data.player_data.size = -data.player_data.size
            if (data.level > data.player_data.level) {
                data.player_data.tarPos.y += this.disList[data.level - data.player_data.level]
            } else {
                data.player_data.tarPos.y -= 300
            }
        } else if(data.flag == 'eaten') {
            console.log('吃鱼的宽度',this.getWidth(),'缩放',this.node.scaleX)
            console.log('被吃鱼的开始位置',640 + (this.getWidth() * this.node.scaleX) / 2)
            this.node.x = 640 + (this.getWidth() * this.node.scaleX) / 2
        } else if(data.flag == 'eat') {
            
        } else if(data.flag == 'meet') {
            data.player_data.tarPos.x = 640 + (this.getWidth() * this.node.scaleX) / 2
        }

        this.node.y = data.player_data.tarPos.y
        // change skin
        this.runToPlayer(data.player_data.tarPos,data.flag,data.type)

    },

    runToPlayer(pos,flag,type) {
        let adjustWidth = 0
        if(flag == 'eaten'){
            adjustWidth = this.getWidth() * this.node.scaleX / 2
        }
        this.node.runAction(cc.sequence(cc.moveTo(this._showTime,cc.p(pos.x+adjustWidth,pos.y)),cc.callFunc(()=>{
            if(flag != 'eaten') {
                this.node.destroy()
            } else {
                KUN.ResCache.setSpriteFrame(this.getComponent(cc.Sprite),'fish/yu'+type)
                this.node.runAction(cc.sequence(cc.moveTo(this._showTime,-640-adjustWidth,pos.y),cc.callFunc(()=>{
                    this.node.destroy()
                })))
            }
        })))
    },

    getWidth(){
        return this.node.getContentSize().width
    }
});
