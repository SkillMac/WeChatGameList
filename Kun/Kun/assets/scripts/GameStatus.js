let T = {
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
    fishCounts: 20,
    // default Growth range
    size_cfg_p:[0.4,0.8],
    // ======player fish config======
    perLevel: 10,
    size_cfg_p: [[0.4,0.8]],
    // ======enemy fish config======
    size_cfg_mul_e: 0.7,

    // ======game obj flag======
    // eating   loading   swimming
    statusList: ['loading', 'eating', 'idle', 'mapping', 'noEnergy'],
    status: ''
};

T.speedList = [T.speed1,T.speedC1,T.speed2,T.speedC2,T.speed3]
T.status = T.statusList[0]

export default T;