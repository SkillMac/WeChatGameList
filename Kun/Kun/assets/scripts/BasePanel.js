
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(ctrl, callback) {
        this._ctrl = ctrl
        this._callback = callback
        this._endFunc = null
        return this
    },

    showDialog(e, p) {
        this.node.setScale(0)
        this.node.runAction(cc.scaleTo(0.35,1))
    },

    hideDialog(e,p) {
        this.node.runAction(cc.sequence(cc.scaleTo(0.35,0),cc.callFunc(()=>{
            if(this._callback) {
                this._callback()
            }
            if(this._endFunc) {
                this._endFunc()
            }
            this.node.destroy()
        })))
    }
});
