let _res_cache = {
    _enemy_cache : null,
    _urge_cahe: null,

    preload : function(callfunc) {
        cc.loader.loadResDir('plist', cc.SpriteAtlas, (err, assets)=>{
            // _res_cache._enemy_cache = atlas
            assets.forEach(element => {
                if(element.name == 'enemy.plist') {
                    _res_cache._enemy_cache = element
                } else if (element.name == 'urge.plist') {
                    _res_cache._urge_cahe = element
                } else if (element.name = 'bomb.plist') {
                    _res_cache._bomb_effect_cache = element
                }
            });
            if(callfunc) {
                callfunc()
            };
        });
    },

    getEnemyCache () {
        return _res_cache._enemy_cache
    },

    getUrgeCache () {
        return _res_cache._urge_cahe
    },

    getBombEffectCache() {
        return _res_cache._bomb_effect_cache
    },

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
        let callfunc = function(sf){
            node.spriteFrame = sf;
        }
        this._spriteCache.getSprite(spritePath,callfunc);
    },
};

export default _res_cache;