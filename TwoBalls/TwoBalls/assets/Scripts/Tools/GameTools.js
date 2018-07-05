let GameTools = {
    msgType: {
        clear: 0,
        updateRank: 1,
        submitScore: 2,
        updateSelfRank: 3,
        groupShare: 4,
        slideRank: 5,
        hitCenterRank: 6,
    },

    sendMessage(data) {
        if(CC_WECHATGAME) {
            // console.log('send sub content data');
            let content = window.wx.getOpenDataContext();
            content.postMessage(data);
        }
    },

    setLocalData(key, value) {
        cc.sys.localStorage.setItem(key, value);
    },

    getLocalData(key, type) {
        
        let vals = cc.sys.localStorage.getItem(key);
        if(type == 1) {
            vals = Number(vals);
        }
        return vals;
    },

    showLabelEffect(parent,startPos, text, endPos, moveTime, fadeTime, startDelayTime) {
        cc.log(parent,startPos,text,endPos,moveTime,fadeTime, startDelayTime);
        cc.loader.loadRes("prefab/labelEffect", cc.Prefab, (err, prefab)=>{
            let node = cc.instantiate(prefab);
            let sp = node.getComponent('showMsgEffect');
            parent.addChild(node);
            node.setPosition(startPos);
            node.getComponent(cc.Label).string = text;
            sp.show();
        });
    },
};

export default GameTools;