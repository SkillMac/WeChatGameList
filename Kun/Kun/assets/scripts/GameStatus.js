let T = {
    address:'https://vdgames.vdongchina.com:9092/',
    // L1,L2,L3 move speed
    speed1: 30,
    speed2: 20,
    speed3: 10,
    // C1,C2 move speed
    speedC1: 25,
    speedC2: 15,
    // move speed mul
    target_speed_mul: 5,
    speed_mul: 1,

    // ======base fish config======
    showTime: 3,
    // display size
    showSize: cc.winSize,

    // ======base fish config======
    // default Growth range
    size_cfg_p:[0.4,0.8],
    // ======player fish config======
    perLevel: 10,
    size_cfg_p: [[0.4,0.8]],
    // ======enemy fish config======
    size_cfg_mul_e: 0.7,
    enemyType : '',

    // ======game obj flag======
    // eating   loading   swimming
    //              0           1       2           3       4           5
    statusList: ['loading', 'eating', 'idle', 'mapping', 'noEnergy', 'rank'],
    status: '',

    weChatData: {},
    weChatFuncType: {
        fail: -1,
        freeEnergy: 0 ,
    },

    levelKeyList: ['levelData'],
    msgType: {
        clear:0, // 清除
        updateRank: 1, // 跟新排行榜
        submitScore: 2, // 提交分数
        groupShare: 3, // 群排行
        slideRank: 4,   
    }
};

T.speedList = [T.speed1,T.speedC1,T.speed2,T.speedC2,T.speed3]
T.status = T.statusList[0]

export default T;