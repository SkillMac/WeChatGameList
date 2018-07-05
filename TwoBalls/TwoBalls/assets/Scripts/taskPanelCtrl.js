
let GameTools = require('GameTools');
cc.Class({
    extends: cc.Component,

    properties: {
        level: cc.Label,
        typeN: '',
        curLevel: 1,
        addHelpLevel: 1,
        addAdLevel: 1,
        maxLevel: 10,
        addLevelFLabel: cc.Label,
        addLevelAdLabel: cc.Label,
        maxFClickCounts: 5,
        maxAdClickCounts: 5,
    },

    onLoad () {
        this.init();
    },

    start () {

    },

    init() {
        // 储存当前的值 做恢复用
        this.addHelpLevel_ = this.addHelpLevel;
        this.addAdLevel_ = this.addAdLevel;

        this.dataHelp = this.node.parent.getComponent('TaskData');
        this.clickData = this.dataHelp.clickData;
        if(this.typeN == 'big') {
            this.curLevel = this.clickData.bigLevel;
        }
        else if (this.typeN == 'speed') {
            this.curLevel = this.clickData.speedLevel;
        }
        // cc.log('数据',this.clickData);
        // console.log('当前速度',this.curLevel);
        this.checkAddLevel();
        this.showResult();
    },

    setLeve( l, type_m ) {
        if(this.checkIsAddLeval(l, type_m)) {
            this.curLevel += l;
            this.level.string = this.curLevel;
            if(this.typeN == 'big') {
                cc.TB.GAME.bigLevel = this.curLevel;
            }
            else if(this.typeN == 'speed') {
                cc.TB.GAME.speedLevel = this.curLevel;
            }
            this.writeData();
            this.checkAddLevel();
        }
        else {
            // console.log('冷却中!!!!!');
        }
    },

    helpBtnEvent(event) {
        cc.TB.wco.groupShare('share',() => {
            this.setLeve(this.addHelpLevel, 'f');
        });
        // console.log('分享');
    },

    adBtnEvent(event) {
        // todo
        // cc.log('看广告');
        this.setLeve(this.addAdLevel,'ad');
    },

    closeBtnEvent(event) {
        // console.log('关闭');
        this.node.parent.destroy();
    },

    checkIsAddLeval(l, type_) {
        this.readData();
        cc.log(this.typeN, this.clickData);
        if (this.curLevel + l > this.maxLevel) {
            return false;
        }
        if (new Date().getTime() - this.clickData.curClickTime < this.dataHelp.delayTime) {
            if(type_ == 'ad') {
                //return true;
            }else {
                return false;
            }

            // return false;
        }
        this.clickData.lastClickTime = this.clickData.curClickTime;
        this.clickData.curClickTime = new Date().getTime();
        if(type_ == 'f') {
            this.clickData.fClickCount += 1;
        }
        else if(type_ == 'ad') {
            this.clickData.adClickCount += 1;
        }
        return true;
    },

    writeData() {
        this.dataHelp.clickData = this.clickData;
        if(this.typeN == 'big') {
            this.dataHelp.clickData.bigLevel = this.curLevel;
        }
        else if (this.typeN == 'speed') {
            this.dataHelp.clickData.speedLevel = this.curLevel;
        }
        this.dataHelp.writeData();
    },

    readData() {
        this.dataHelp.readData();
        this.clickData = this.dataHelp.clickData;
        if(this.typeN == 'big') {
            this.curLevel = this.clickData.bigLevel;
        }
        else if (this.typeN == 'speed') {
            this.curLevel = this.clickData.speedLevel;
        }
    },

    checkAddLevel() {
        if(this.clickData.fClickCount >= this.maxFClickCounts) {
            this.addHelpLevel = 0;
        }
        if(this.clickData.adClickCount >= this.maxAdClickCounts) {
            this.addAdLevel = 0;
        }
    },

    showResult() {
        this.level.string = this.curLevel;
        this.addLevelFLabel.string = this.addHelpLevel + 'L';
        this.addLevelAdLabel.string = this.addAdLevel + 'L';
    },

    clearData() {
        this.dataHelp.clearData();
        this.curLevel = 1;
        this.addAdLevel = this.addAdLevel_;
        this.addHelpLevel = this.addAdLevel_;
        this.addLevelAdLabel.string = this.addAdLevel + 'L';
        this.addLevelFLabel.string = this.addHelpLevel + 'L';
        this.level.string = this.curLevel;
    },
});
