import BaseFish from "BaseFish";

cc.Class({
    extends: BaseFish,

    properties: {
        
    },

    init(data,ctrl) {
        // this.widthList = [0,1031,1186,1206,1230,1147]
        this.disList = [0,350,700,700]
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

        let type = data.flag == 'eaten' ? data.type + '_o' : data.type

        KUN.ResCache.setSpriteFrame(this.getComponent(cc.Sprite),'fish/yu' + type)
        if(data.flag == 'passBy') {
            data.player_data.tarPos.x = 640 + (this.getWidth_me() * this.node.scaleX) / 2
            // data.player_data.size = -data.player_data.size
            if (data.level > data.player_data.level) {
                data.player_data.tarPos.y += 400 //this.disList[data.level - data.player_data.level]
            } else {
                data.player_data.tarPos.y -= 300
            }
        } else if(data.flag == 'eaten') {
            this.node.x = 640 + (this.getWidth_me() * this.node.scaleX) / 2
        } else if(data.flag == 'eat') {
            
        } else if(data.flag == 'meet') {
            data.player_data.tarPos.x = 640 + (this.getWidth_me() * (-this.node.scaleX))
        }

        this.node.y = data.player_data.tarPos.y

        // console.log('flag',data.flag,'| 目标位置',data.player_data.tarPos,'| 开始位置',this.node.x,this.node.y,'| 缩放值', this.node.scaleX)
        // change skin
        this.runToPlayer(data.player_data.tarPos,data.flag,data.type)

    },

    runToPlayer(pos,flag,type) {
        let adjustWidth = 0
        if(flag == 'eaten'){
            pos.x = 0
            adjustWidth = this.getWidth_me() * this.node.scaleX / 2
        }
        this.node.runAction(cc.sequence(cc.moveTo(this._showTime,cc.p(pos.x+adjustWidth,pos.y)),cc.callFunc(()=>{
            if(flag != 'eaten') {
                this.node.destroy()
            } else {
                this._ctrl.playerToDie()
                KUN.ResCache.setSpriteFrame(this.getComponent(cc.Sprite),'fish/yu'+type)
                this.node.runAction(cc.sequence(cc.moveTo(this._showTime,-640-adjustWidth,pos.y),cc.callFunc(()=>{
                    this.node.destroy()
                })))
            }
        })))
    },

    getWidth_me(){
        return 1050//node_.getComponent(cc.Sprite).spriteFrame.getRect().width
    }
});
