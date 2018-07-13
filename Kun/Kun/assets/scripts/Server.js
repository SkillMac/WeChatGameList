let T = {
    defaultEnemyData:{
        type:1,
        level: 0.5,
    },

    defaultUserData: {
        coin:0,
        energy:50,
        level:1,
    },

    incrementUserData: {
        coin_dt: 1,
        energy_dt: -1,
        level_dt: 0,
    },

    defaultFishPriceData: [0,3000,0],

    getEnemyData() {
        return T.defaultEnemyData
    },

    getUserInfo() {
        return T.defaultUserData
    },

    _calcUserData() {
        let data = T.defaultUserData
        data.coin += 1
        data.energy -= 1
        data.level += 0
    },

    touchOnce() {
        T._calcUserData()
        let data = T.getUserInfo()
        KUN.UserData.setCoin(data.coin)
        KUN.UserData.setLevel(data.level)
        KUN.UserData.setEnergy(data.energy)
    },

    getFishPrice() {
        return T.defaultFishPriceData
    },
}

export default T;