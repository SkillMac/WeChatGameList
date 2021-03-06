let GameTools = {
    address: 'https://vdgames.vdongchina.com',
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
            if(typeof(wx.getOpenDataContext)!=undefined) {
                let content = wx.getOpenDataContext();
                content.postMessage(data);
            } else {
                cc.TB.wco.showTips();
            }
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
        // cc.log(parent,startPos,text,endPos,moveTime,fadeTime, startDelayTime);
        cc.loader.loadRes("prefab/labelEffect", cc.Prefab, (err, prefab)=>{
            let node = cc.instantiate(prefab);
            let sp = node.getComponent('showMsgEffect');
            parent.addChild(node);
            node.setPosition(startPos);
            node.getComponent(cc.Label).string = text;
            sp.show();
        });
    },

    httpGet(url, reqData, callback) {
        let timeOutFlag = false
        url += '?';
        for (let item in reqData) {
            url += item + '=' + reqData[item] + "&"
        }
        //console.log('请求的连接', GameTools.address + url)

        const xhr = cc.loader.getXMLHttpRequest()
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                if(timeOutFlag) return
                var response = xhr.responseText;
                if(response) {
                    if(callback) {
                        callback(response)
                    }
                } else {
                    // todo    
                }
            }
        };
        xhr.timeout = 5000

        xhr.onerror = p =>{
            timeOutFlag = true
            if(callback) callback('-1')
        }

        xhr.ontimeout = p =>{
            timeOutFlag = true
            if(callback) callback('-2')
        }
        xhr.withCredentials = true;
        xhr.open("GET", GameTools.address + url, true);
        xhr.send();
    },

    httpPost() {
        //todo
    },

    isShowPanelByServer(name) {
        if(!cc.TB.GAME.panelCfg || cc.TB.GAME.panelCfg[name] != '1') {
            return false
        }
        else {
            return true
        }
    },

    destroy(node_) {
        if(node_) node_.destroy()
    }
};

export default GameTools;