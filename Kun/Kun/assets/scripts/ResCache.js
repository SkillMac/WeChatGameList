let T = {
    /// sprite cache ///
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
        console.log('xxxxxx',spritePath)
        let callfunc = function(sf){
            node.spriteFrame = sf;
        }
        this._spriteCache.getSprite(spritePath,callfunc);
    },
}

export default T;