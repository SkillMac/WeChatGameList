
cc.Class({
    extends: cc.Component,

    properties: {
        camera: cc.Camera
    },

    onLoad() {
        this._birthCtrl = this.node.getChildByName('Birth').getComponent('BirthCtrl')
        this._birthCtrl.init()
        this._playerCtrl = this.node.getChildByName('Player').getComponent('Player')
        this._playerCtrl.init()
        this._touchCtrl = this.node.getChildByName('TouchNode').getComponent('TouchEvent')
        this._touchCtrl.init(this)
    },

    zoomOut() {
        // this.camera.zoomRatio = 2.9
    },

    zoomIn() {

    },

    // ==== enmey module ====

    buildNewFish() {
        let data = KUN.Server.getEnemyData()
        // adjust data with player data
        let player_data = this._playerCtrl.getData()
        data.player_data = player_data
        this._birthCtrl.buildNewFish(data)
        // tell player open mouth
        this._playerCtrl.openMouth()
    },

});
