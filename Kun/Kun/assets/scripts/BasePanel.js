
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    init(ctrl, callback) {
        this._ctrl = ctrl
        this._callback = callback
        this._endFunc = null
        this._showTime = 0.1
        return this
    },

    showDialog(e, p) {
        this.node.setScale(0.7)
        this.node.runAction(cc.scaleTo(this._showTime,1))
    },

    hideDialog(e,p) {
        this.node.runAction(cc.sequence(cc.scaleTo(0.1,0),cc.callFunc(()=>{
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
