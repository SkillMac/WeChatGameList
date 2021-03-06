
cc.Class({
    extends: cc.Component,

    properties: {
        time: cc.Label,
        timerBg: cc.Node
    },

    start() {
        this.ti = -1
        this._callback = null
        this._flag = true
        this.hide()
        this.startTimer()
    },

    init (time_, callback_) {
        this.ti = time_
        this._callback = callback_
        this.show()
    },

    showLeftTime(dt)
    {   
        if(this.ti <= 0){
            if(this._flag){
                this.hide()
                if(this._callback) {
                    this._callback()
                    this._callback = null
                }
            }
            return
        }
        this.ti --
        this.time.string = KUN.GameTools.formatSeconds(this.ti)
    },

    startTimer(){
        cc.director.getScheduler().schedule(this.showLeftTime, this, 1)
    },

    stopTimer(){
        cc.director.getScheduler().unschedule(this.showLeftTime,this)
    },

    show(){
        this._flag = true
        this.timerBg.active = true
        this.node.active = true
    },

    hide(){
        this._flag = false
        this.ti = -1
        this.timerBg.active = false
        this.node.active = false
    },

    getTime(){
        return this.ti
    }
});
