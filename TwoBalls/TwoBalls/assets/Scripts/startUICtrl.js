
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad () {
        this.initClickEvent();
    },

    initClickEvent() {
        let startBtn = this.node.getChildByName('startBtn');
        startBtn.on('click', this.startBtnVent, this);

        let rankBtn = this.node.getChildByName('kingBtn');
        rankBtn.on('click', this.rankBtnEvent, this)

        let groupBtn = this.node.getChildByName('shareBtn');
        groupBtn.on('click', this.groupShare, this);
    },

    startBtnVent(event) {
        cc.TB.GAME.isPlaying = true;
        this.node.active = false;
        cc.TB.GAME.score = 0;
        cc.TB.GAME.checkPoint = 0;
        this.node.dispatchEvent(new cc.Event.EventCustom("start_game_btn",true));
    },

    rankBtnEvent(event) {
        let self = this;
        cc.loader.loadRes("prefab/rank", cc.Prefab, function(err, prefab){
            let node = cc.instantiate(prefab);
            self.node.parent.addChild(node);
        });
    },

    groupShare(event) {
        cc.TB.wco.groupShare('share');
    },

    show() {
        this.node.active = true;
    },
});
