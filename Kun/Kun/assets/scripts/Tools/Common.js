
cc.Class({
    extends: cc.Component,

    properties: {
        show1_p: cc.ParticleSystem,
    },

    show1() {
        this.show1_p.resetSystem()
    },

    show2(e, p) {
        KUN.GameTools.playAudio('btn1')
        if(KUN.GameStatus.status == KUN.GameStatus.statusList[1]) return
        this.show2_f = !this.show2_f
        let t = 0.1
        if(this.show2_f) {
            // this.node.runAction(cc.moveTo(t, cc.p(0,0)))
            this.node.active = true
            this.node.y = 0
            this.node.setScale(0.7)
            this.node.runAction(cc.scaleTo(t,1))
            KUN.GameStatus.status = KUN.GameStatus.statusList[3]
        } else {
            t = 0
            this.node.active = false
            KUN.GameStatus.status = KUN.GameStatus.statusList[2]
        }
        return t
    },
});
