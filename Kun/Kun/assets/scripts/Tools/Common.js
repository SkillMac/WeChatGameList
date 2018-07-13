
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
        } else {
            this.node.runAction(cc.moveTo(t, cc.p(0,-720)))
        }
    }
});
