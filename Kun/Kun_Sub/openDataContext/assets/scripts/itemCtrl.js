let colorCfg = [
    new cc.Color(253,248,0,255),
    new cc.Color(255,144,2,255),
    new cc.Color(253,66,0,255),
];

cc.Class({
    extends: cc.Component,

    properties: {
        index: cc.Label,
        image: cc.Sprite,
        nickName: cc.Label,
        score: cc.Label, // 如果是连击话 score 代表 连击数
        hitImage: cc.Sprite,
    },

    start () {
        
    },

    init(index, data, isHitCenterRank) {
        let avatarUrl = data.avatarUrl;
        let nickName = data.nickname.length <= 6 ? data.nickname : data.nickname.substr(0, 6) + "...";
        let scoreData = data.KVDataList[0].value;
        if(typeof(scoreData) ==='string'){
            scoreData = this.str2json(data.KVDataList[0].value);
        }

        if(colorCfg[index]){
            this.index.node.color = colorCfg[index];
        }
        this.index.string = (index+1).toString();
        this.createImage(avatarUrl);
        this.nickName.string = nickName;
        if(isHitCenterRank) {
            this.score.string = "" + scoreData.hitCounts.counts
            this.createHitImage(scoreData.hitCounts.counts)
            if(this.hitImage.node.width >200) {
                this.hitImage.node.setScale(200/this.hitImage.width)
            }else if (this.hitImage.node.height > 100) {
                this.hitImage.node.setScale(100/this.hitImage.height)
            }
        } else {
            this.score.string = "" + scoreData.wxgame.score;
        }
    },

    createImage(avatarUrl) {
        if (CC_WECHATGAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.image.spriteFrame = new cc.SpriteFrame(texture);
                    } catch (e) {
                        cc.log(e);
                        this.image.node.active = false;
                    }
                };
                image.src = avatarUrl;
            }catch (e) {
                cc.log(e);
                this.image.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                this.image.spriteFrame = new cc.SpriteFrame(texture);
            });
        }
    },

    createHitImage(hitCounts) {
        if (CC_WECHATGAME) {
            if(hitCounts >108) {
                hitCounts = 108
            }
            cc.loader.loadRes('urge',cc.SpriteAtlas, (err, asset)=>{
                this.hitImage.spriteFrame = asset.getSpriteFrame(''+hitCounts)
            })
        }
    },

    str2json(str) {
        return JSON.parse(str);
        
    },
    json2str() {
        return JSON.stringify(str);
    },
});
