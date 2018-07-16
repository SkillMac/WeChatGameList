
cc.Class({
    extends: cc.Component,

    properties: {
        show1_p: cc.ParticleSystem,
    },

    show1() {
        this.show1_p.resetSystem()
    },

    show2(e, p) {
        this.show2_f = !this.show2_f
        let t = 0.35
        if(this.show2_f) {
            this.node.runAction(cc.moveTo(t, cc.p(0,0)))
            KUN.GameStatus.status = KUN.GameStatus.statusList[3]
        } else {
            this.node.runAction(cc.moveTo(t, cc.p(0,-720)))
            KUN.GameStatus.status = KUN.GameStatus.statusList[2]
        }
    },

    show3(e,p) {
        this.node.setScale(0)
        this.node.runAction(cc.scaleTo(0.35,1))
    }
});
