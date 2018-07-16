
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(ctrl,callback) {
        KUN.GameStatus.status = KUN.GameStatus.statusList[4]
        this._callback = callback
        this.flagList = []
    },

    hBEvent(e,p) {
        let obj = e.target
        // to do
    },

    offEvent(e,p) {
        this.node.runAction(cc.sequence(cc.scaleTo(0.35,0),cc.callFunc(()=>{
            if(this.callback) {
                this.callback(callback)
            }
            this.node.destroy()
            KUN.GameStatus.status = KUN.GameStatus.statusList[2]
        })))
    },
});
