
let GameTools = require('GameTools');
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        this.init();
    },

    start () {

    },

    init () {
        this.key = cc.TB.GAME.taskKey;
        this.delayTime = 30*60*1000;
        this.clickData = {
            lastClickTime : 0,
            curClickTime: 0,
            fClickCount: 0,
            adClickCount: 0,
            bigLevel: 1,
            speedLevel: 1,
        };
        if(GameTools.getLocalData(this.key) == undefined || GameTools.getLocalData(this.key) == null || GameTools.getLocalData(this.key) == '') {
            this.writeData();
        }
        this.readData();
        // -------------------------- 测试  //
        // this.clearData();
    },

    writeData() {
        let strVal = JSON.stringify(this.clickData);
        GameTools.setLocalData(this.key,strVal);
    },

    readData() {
        let val = GameTools.getLocalData(this.key);
        this.clickData = JSON.parse(val);
    },

    clearData() {
        let clickData = {
            lastClickTime : 0,
            curClickTime: 0,
            fClickCount: 0,
            adClickCount: 0,
            bigLevel: 1,
            speedLevel: 1,
        };
        GameTools.setLocalData(this.key,JSON.stringify(clickData));
        this.readData();
        cc.TB.GAME.bigLevel = 1;
        cc.TB.GAME.speedLevel = 1;
    }
});
