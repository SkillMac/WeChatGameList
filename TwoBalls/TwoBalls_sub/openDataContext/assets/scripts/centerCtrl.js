let msgType = {
    updateRank: 1, // 跟新排行榜
    submitScore: 2, // 提交分数
    updateSelfRank: 3 // 跟新提交页面的排行
}
cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        itemPrefab: cc.Prefab,
        selfView: cc.Node,
        selfPrefav: cc.Prefab,
        title: cc.Label,
    },
    onLoad() {
        this.title.node.active = false;
        this.prefabList = [];
    },
    start () {
        if(CC_WECHATGAME) {
            window.wx.onMessage(data => {
                console.log("收到消息");
                console.log(data);
                if (data.type == msgType.updateRank) {
                    this.updateRank(data.keyList,false);
                }
                else if(data.type == msgType.submitScore) {
                    this.submitScore(data.scoreData);
                }
                else if(data.type == msgType.updateSelfRank) {
                    this.updateRank(data.keyList,true);
                }
            });
        }
    },
    destroyChild() {
        if(this.prefabList.length <= 0) {
            return;
        }
        this.prefabList.forEach(element => {
            element.destroy();
        });
    },
    updateRank(keyList_, isGameOverRank) {
        // if(!isGameOverRank) {
        //     this.content.parent.parent.active = true;
        // }else {
        //     this.selfView.parent.active = true;
        // }
        
        this.destroyChild();
        // 获取微信数据
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    console.log('获取排行数据 结束排行 ', isGameOverRank ,userRes.data);
                    let userData = userRes.data[0];
                    wx.getFriendCloudStorage({
                        keyList: keyList_,
                        success: res => {
                            let data = res.data;
                            console.log("获取排行数据 success", res);
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                a.KVDataList[0].value = JSON.parse(a.KVDataList[0].value);
                                b.KVDataList[0].value = JSON.parse(b.KVDataList[0].value);
                                return b.KVDataList[0].value.wxgame.score - a.KVDataList[0].value.wxgame.score;
                            });

                            // content
                            for (let i = 0; i < data.length; i++) {
                                let playerInfo = data[i];
                                if(isGameOverRank) {
                                    // 更新 结算 排行榜
                                    if (data[i].avatarUrl == userData.avatarUrl) {
                                        let createItem = index => {
                                            if(playerInfo.KVDataList.length !=0){
                                                let lastPlayer = cc.instantiate(this.selfPrefav);
                                                this.prefabList.push(lastPlayer);
                                                lastPlayer.getComponent('itemCtrl').init(index,data[index]);
                                                this.selfView.addChild(lastPlayer);
                                            }
                                        };
                                        if(i == 0) {
                                            // todo
                                            createItem(i);
                                            if(i+2<= data.length) {
                                                createItem(i+1);
                                            }
                                            if(i+3<= data.length) {
                                                createItem(i+2);
                                            }
                                        }
                                        else {
                                            
                                            createItem(i-1);
                                            createItem(i);
                                            if(i+2 <= data.length) {
                                                createItem(i+1);
                                            }
                                        }
                                        break;
                                    }
                                }
                                else {
                                    if(playerInfo.KVDataList.length !=0){
                                        // 更新排行榜
                                        let node = cc.instantiate(this.itemPrefab);
                                        this.prefabList.push(node);
                                        node.getComponent('itemCtrl').init(i,playerInfo);
                                        this.content.addChild(node);
                                        //-241
                                        if (data[i].avatarUrl == userData.avatarUrl) {
                                            let node = cc.instantiate(this.itemPrefab);
                                            this.prefabList.push(node);
                                            node.getComponent('itemCtrl').init(i,playerInfo);
                                            this.node.addChild(node);
                                            node.y = -241;
                                        }
                                    }
                                    
                                }
                            }
                        },
                        fail: res => {
                            console.log("wx.getFriendCloudStorage fail", res);
                        },
                    });
                },
                fail: (res) => {
                    console.log('获取用户信息失败',res);
                },
            });
        }
    },

    submitScore(scoreData) {
       if (CC_WECHATGAME) {
        window.wx.getUserCloudStorage({
            keyList: [scoreData.key],
            //score
            success: function (res) {
                console.log('提交分数', 'success', res);
                
                let score = scoreData.score;
                if (res.KVDataList.length != 0) {
                    let jsobj = JSON.parse(res.KVDataList[0].value);
                    if(jsobj.wxgame.score > score) {
                        return;
                    }
                }
                let data = new Array();
                let dataFormat = {
                    "wxgame": {
                        "score": score,
                        "update_time": new Date().getTime()
                    },
                }
                data.push({
                    key: scoreData.key,
                    value: JSON.stringify(dataFormat),
                });
                console.log("提交的结果是",data);
                window.wx.setUserCloudStorage({
                    KVDataList:data,
                    success: function (res) {
                                console.log('设置分数', 'success', res);
                            },
                    fail: function (res) {
                        console.log('设置分数', 'fail');
                    },
                    complete: function (res) {
                        console.log('设置分数', 'ok');
                    }  
                });
            },
            fail: function (res) {
                console.log('getUserCloudStorage', 'fail');
            },
            complete: function (res) {
                console.log('getUserCloudStorage', 'ok');
            }
        });
        }
    },
});
