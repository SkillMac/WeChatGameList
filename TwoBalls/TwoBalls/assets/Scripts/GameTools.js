let GameTools = {
    msgType: {
        clear: 0,
        updateRank: 1,
        submitScore: 2,
        updateSelfRank: 3,
        groupShare: 4,
    },
    _spriteCache: {
        _cahce:{},
        addSprite: function(path, callback) {
            let self = this;
            cc.loader.loadRes(path, cc.SpriteFrame, function(err, spriteFrame){
                self._cahce[path]  = spriteFrame;
                callback(spriteFrame);
            });
        },
        getSprite: function(key, callback) {
            if (this.checkIsExist(key)) {
                callback(this._cahce[key]);
                return;
            }else {
                this.addSprite(key, callback);
                return;
            }
            return null;
        },
        checkIsExist(key) {
            if(this._cahce[key]) {
                return true;
            }
            return false;
        },
    },
    setSpriteFrame: function(node, spritePath) {
        let callfunc = function(sf){
            node.spriteFrame = sf;
        }
        this._spriteCache.getSprite(spritePath,callfunc);
        cc.log('当前帧缓存',this._spriteCache);
    },
    sendMessage(data) {
        if(CC_WECHATGAME) {
            console.log('send sub content data');
            let content = window.wx.getOpenDataContext();
            content.postMessage(data);
        }
    },
};

module.exports = GameTools;