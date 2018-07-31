let msgType = {
    clear:0, // 清除
    updateRank: 1, // 跟新排行榜
    submitScore: 2, // 提交分数
    groupShare: 3, // 群排行
    slideRank: 4,   
}
cc.Class({
    extends: cc.Component,

    properties: {
        content: cc.Node,
        itemPrefab: cc.Prefab,
        scrollView: cc.ScrollView,
    },
    onLoad() {
        this.prefabList = [];
        this.originPosY = this.scrollView.getScrollOffset().y
        this.contentList = []
        this.contentList.push(this.content)
    },
    start () {
        if(CC_WECHATGAME) {
            window.wx.onMessage(data => {
                // console.log("收到消息");
                // console.log(data);
                if (data.type == msgType.updateRank) {
                    this.updateRank(data.keyList,false);
                }
                else if(data.type == msgType.submitScore) {
                    this.submitScore(data.scoreData);
                }
                else if(data.type == msgType.clear) {
                    this.destroyChild();
                }
                else if(data.type == msgType.groupShare) {
                    this.fetchGroupFriendData(data.key, data.ticket);
                }
                else if(data.type == msgType.slideRank) {
                    this.slideRank(data.y, data.isHitRank)
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
        this.prefabList = [];
    },

    updateRank(keyList_) {
        this.hideAllContentView()
        this.destroyChild();
        this.content.active = true
        // 获取微信数据
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    // let userData = userRes.data[0];
                    wx.getFriendCloudStorage({
                        keyList: keyList_,
                        success: res => {
                            let data = res.data;
                            // console.log("获取排行数据 success", res);
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
                                if(typeof(a.KVDataList[0].value) === 'string') {
                                    a.KVDataList[0].value = JSON.parse(a.KVDataList[0].value);
                                }
                                if(typeof(b.KVDataList[0].value) === 'string') {
                                    b.KVDataList[0].value = JSON.parse(b.KVDataList[0].value);
                                }
                                return b.KVDataList[0].value.wxgame.score - a.KVDataList[0].value.wxgame.score;
                            });
                            this.destroyChild();
                            // content
                            for (let i = 0; i < data.length; i++) {
                                let playerInfo = data[i];
                                if(playerInfo.KVDataList.length !=0){
                                    // 更新排行榜
                                    let node = cc.instantiate(this.itemPrefab);
                                    this.prefabList.push(node);
                                    node.getComponent('itemCtrl').init(i,playerInfo,false);
                                    this.content.addChild(node);

                                    // //-241
                                    // if (data[i].avatarUrl == userData.avatarUrl) {
                                    //     let node = cc.instantiate(this.itemPrefab);
                                    //     this.prefabList.push(node);
                                    //     node.getComponent('itemCtrl').init(i,playerInfo,false);
                                    //     this.node.addChild(node);
                                    //     node.y = -241;
                                    // }
                                }
                            }
                            this.scrollView.scrollToTop(0.01)
                            this.node.runAction(cc.sequence(cc.delayTime(0.02),cc.callFunc(()=>{
                                this.originPosY = this.scrollView.getScrollOffset().y
                            })))
                        },
                        fail: res => {
                            // console.log("wx.getFriendCloudStorage fail", res);
                        },
                    });
                },
                fail: (res) => {
                    // console.log('获取用户信息失败',res);
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
                // console.log('提交分数', 'success', res);
                
                let score = scoreData.score;
                let scoreTime = new Date().getTime()
                let jsobj = null
                let isUploadData = false

                if (res.KVDataList.length != 0) {
                    let parse = (index)=>{
                        if(!res.KVDataList[index]) {
                            return null
                        }
                        if(typeof(res.KVDataList[index].value) == 'string') {
                            return JSON.parse(res.KVDataList[index].value)
                        } else {
                            res.KVDataList[index].value
                        }
                    }

                    jsobj = parse(0)
                    if (jsobj && jsobj.wxgame.score < score) {
                        isUploadData = true
                    } else if (jsobj && jsobj.wxgame.score >= score) {
                        score = jsobj.wxgame.score
                        scoreTime = jsobj.wxgame.update_time
                    }
                } else {
                    isUploadData = true
                }

                let data = new Array();
                let dataFormat = {
                    "wxgame": {
                        "score": score,
                        "update_time": scoreTime
                    },
                }

                if(isUploadData) {
                    data.push({
                        key: scoreData.key,
                        value: JSON.stringify(dataFormat),
                    });
                    
                    //console.log("提交的结果是",data);
                    window.wx.setUserCloudStorage({
                        KVDataList:data,
                        success: function (res) {
                      //              console.log('设置分数', 'success', res);
                                },
                        fail: function (res) {
                        //    console.log('设置分数', 'fail');
                        },
                        complete: function (res) {
                          //  console.log('设置分数', 'ok');
                        }  
                    });
                }
            },
            fail: function (res) {
                // console.log('getUserCloudStorage', 'fail');
            },
            complete: function (res) {
                // console.log('getUserCloudStorage', 'ok');
            }
        });
        }
    },

    fetchGroupFriendData(keyList_, ticket) {
        this.hideAllContentView()
        this.content.active = true
        this.destroyChild();
        if (CC_WECHATGAME) {
            wx.getUserInfo({
                openIdList: ['selfOpenId'],
                success: (userRes) => {
                    let userData = userRes.data[0];
                    wx.getGroupCloudStorage({
                        keyList: [keyList_],
                        shareTicket: ticket,
                        success: res => {
                            let data = res.data;
                            // console.log("获取群排行数据 success", res, 'ticket', ticket);
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
                                if(typeof(a.KVDataList[0].value) === 'string') {
                                    a.KVDataList[0].value = JSON.parse(a.KVDataList[0].value);
                                }
                                if(typeof(b.KVDataList[0].value) === 'string') {
                                    b.KVDataList[0].value = JSON.parse(b.KVDataList[0].value);
                                }
                                return b.KVDataList[0].value.wxgame.score - a.KVDataList[0].value.wxgame.score;
                            });

                            // content
                            for (let i = 0; i < data.length; i++) {
                                let playerInfo = data[i];
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
                            this.scrollView.scrollToTop(0.01)
                            this.node.runAction(cc.sequence(cc.delayTime(0.02),cc.callFunc(()=>{
                                this.originPosY = this.scrollView.getScrollOffset().y
                            })))
                        },
                        fail: res => {
                            // console.log("wx.getGroupCloudStorage fail", res);
                        },
                    });
                },
                fail: (res) => {
                    // console.log('获取群信息失败',res);
                },
            });
        }
    },

    slideRank(y, isHitRank) {
        let maxOffsetY = isHitRank ? this.scrollViewHit.getMaxScrollOffset().y :this.scrollView.getMaxScrollOffset().y
        let nextOffsetY = 0
        if(isHitRank) {
            nextOffsetY = this.scrollViewHit.getScrollOffset().y + y
        } else {
            nextOffsetY = this.scrollView.getScrollOffset().y + y
        }
        if(nextOffsetY > maxOffsetY) {
            return
        }
        if(nextOffsetY < this.originPosY) {
            return
        }
        if(nextOffsetY > this.originPosY) {
            if(isHitRank) {
                this.scrollViewHit.stopAutoScroll()
                this.scrollViewHit.scrollToOffset(cc.p(0,nextOffsetY),0.1)
            } else {
                this.scrollView.stopAutoScroll()
                this.scrollView.scrollToOffset(cc.p(0,nextOffsetY),0.1)
            }
        }
    },

    hideAllContentView(node) {
        this.contentList.forEach(element => {
            if(element.active){
                element.active = false
            }
        });
    }
});
