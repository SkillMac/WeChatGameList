import BaseFish from "BaseFish";

cc.Class({
    extends: BaseFish,

    properties: {
        head:cc.Sprite,
    },

    update(dt) {
        if(this._fleeTimeFlag) {
            if(this._time >= this._fleeTime) {
                this._time = 0
                this._fleeTimeFlag = false
                if(this._fleeCounts > 0) {
                    this._wheelCtrl.setDir(-1)
                } else {
                    // to do
                    this._type = 'flee'
                }
                
            }
            this._time += dt
        }
    },

    init(data,ctrl) {
        this.node.removeComponent('Player')
        // this.widthList = [0,1031,1186,1206,1230,1147]
        this._wheelCtrl = this.node.addComponent('NoActionList')
        this._disList = [0,350,700,700]
        this._tex = null
        this.initData(data)
        this._super(ctrl)
        this._ctrl.registerEnemyCtrl(this)
        this.adjustByData(data)
        this.setHead(data.headUrl)
        this.startUp()
        return this
    },

    initData(data) {
        this._type = data.type
        this._flag = data.flag
        KUN.GameStatus.enemyType = data.flag
        this._fleeTime = 0.75
        this._fleeTimeFlag = false
        this._time = 0
        // console.log('产生新鱼的数据',data)
        this._fleeCounts = data.fleeCounts
        this._isDie = false
    },

    startUp() {
        let speed = 500
        this._wheelCtrl.init(speed, obj=>{
            // console.log('敌人死去')
            this.toDie()
        },true)
        let dir = this._flag == 'eaten' ? -1 : 1
        this._wheelCtrl.setDir(dir)
        this._wheelCtrl.setMoveType('other')
        this._wheelCtrl.setSpeedMul(1)
        if(this._flag != 'eaten') {
            this._wheelCtrl.setMaxDis(1950)
            this._wheelCtrl.setMinDis(600)
        } else {
            this._wheelCtrl.setMaxDis(700)
            this._wheelCtrl.setMinDis(-700)
        }
    },

    setHead(url_) {
        if(url_ != '') {
            if(KUN.Server.ONWINDOWS) {
                cc.loader.loadRes(url_,(err,tex)=>{
                    if(err) return
                    this._tex = tex
                    this.head.spriteFrame = new cc.SpriteFrame(tex)
                })
            } else {
                cc.loader.load(KUN.GameStatus.address+url_,(err,tex)=>{
                    if(err) return
                    this._tex = tex
                    this.head.spriteFrame = new cc.SpriteFrame(tex)
                })
            }
            this.head.node.setScale(2 * Math.abs(this.head.node.scaleX)/Math.abs(this.node.scaleX))
        }
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
            this.node.x = 640 - (this.getWidth_me() * this.node.scaleX) / 2
            // data.player_data.tarPos.x = 640 + (this.getWidth_me() * this.node.scaleX) / 2
            if (data.level > data.player_data.level) {
                KUN.GameTools.playAudio('passby')
                data.player_data.tarPos.y += 400
            } else {
                data.player_data.tarPos.y -= 300
            }
        } else if(data.flag == 'eaten') {

            this.node.x = 640 + (this.getWidth_me() * this.node.scaleX) / 2
        } else if(data.flag == 'eat') {
            this.node.x = 640 - (this.getWidth_me() * this.node.scaleX) / 2
        } else if(data.flag == 'meet') {
            this.node.x = 640 - (this.getWidth_me() * Math.abs(this.node.scaleX)) / 2
            //to do
        }
        this.node.y = data.player_data.tarPos.y

    },

    getWidth_me(){
        return this.node.width
    },

    onCollisionEnter(other, self) {
        switch (this._flag) {
            case 'passBy':
                
                break;
            case 'eat':
                
                break;

            case 'meet':

                break;

            case 'eaten':
                if(this._isDie) return ;
                this._isDie = true
                this.node.runAction(cc.sequence(cc.delayTime(1.5),cc.callFunc(()=>{
                    KUN.GameTools.playAudio('eatOrEaten')
                    KUN.Server.lFreeFail()
                    other.getComponent('Player').eatenEvent()
                    
                    KUN.ResCache.setSpriteFrame(this.getComponent(cc.Sprite),'fish/yu'+this._type)
                    this._wheelCtrl.setSpeedMul(3)
                })))
                break;

            default:
                break;
            
        }
    },

    toDie() {
        this._wheelCtrl.setDir(0)
        if(this._flag == 'flee') {
                // if(res == '1') {
                    this._ctrl.finishEatBefore('flee')
                // }
        } else if (this._flag == 'passBy' || this._flag == 'meet' || this._flag == "flee") {
            this._ctrl.finishEatBefore()
        }
        if(this._tex) cc.loader.release(this._tex)
        this._ctrl.unRegisterEnemyCtrl()
        this.node.destroy()
    },

    // onCollisionStay(other, self) {
    //     // to do
    // },
    
    // onCollisionExit(other, self) {
    //     // to do
    // },

    changeDir(dir) {
        if(this._fleeCounts > 0) {
            this._fleeCounts --
            this._wheelCtrl.setDir(dir)
            this._fleeTimeFlag = true
        }
    }
});
