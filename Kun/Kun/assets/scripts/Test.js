
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init()
    },

    /*
    * API
    * Method
    * 
    * addEventListener
    * removeEventListener
    * playAnimation
    * 
    * 
    * 
    * Variable
    * 
    * debugBones
    * 
    * playTimes
    * timeScale
    * animationName
    * armatureName
    * dragonAtlasAsset
    * dragonAsset
    * 
    */

    init() {
        this._armatureDisplay = this.getComponent(dragonBones.ArmatureDisplay);
        this._armatureDisplay.timeScale = 0.2
        this._armatureDisplay.playAnimation('likun_tun',0)
        
    }
});
