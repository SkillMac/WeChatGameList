
cc.Class({
    extends: cc.Component,

    properties: {
        show1_p: cc.ParticleSystem,
    },

    show1() {
        this.show1_p.resetSystem()
    },

    show2(e, p) {
        if(KUN.GameStatus.status == KUN.GameStatus.statusList[1]) return
        this.show2_f = !this.show2_f
        let t = 0.35
        if(this.show2_f) {
            this.node.runAction(cc.moveTo(t, cc.p(0,0)))
            KUN.GameStatus.status = KUN.GameStatus.statusList[3]
        } else {
            this.node.runAction(cc.sequence(cc.moveTo(t, cc.p(0,-720)),cc.callFunc(()=>{
                KUN.GameStatus.status = KUN.GameStatus.statusList[2]
            })))
        }
        return t
    },
});
