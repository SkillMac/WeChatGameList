import BasePanel from "BasePanel";

cc.Class({
    extends: BasePanel,

    properties: {
        
    },

    init(ctrl,callback) {
        KUN.GameStatus.status = KUN.GameStatus.statusList[4]
        this._super(ctrl,callback)
        this.flagList = []
        this._endFunc = ()=>{
            KUN.GameStatus.status = KUN.GameStatus.statusList[2]
        }
        return this
    },

    hBEvent(e,p) {
        let obj = e.target
        // to do
    },
});
