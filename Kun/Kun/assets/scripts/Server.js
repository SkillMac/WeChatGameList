let T = {
    id:'',
    subAddress:'AppController/',
    defaultEnemyData:{
        type:'x1',
        level: 1,
        coin: 1,
    },

    defaultUserData: {
        coin:19,
        energy:50,
        level:1,
        maxEnergy:50,
        fishIndex:1,
        zoom: 3,
        zoom_dt: 0.125,
    },

    incrementUserData: {
        coin_dt: 1,
        energy_dt: 1,
        level_dt: 0,
    },

    defaultFishPriceData: [0,20,50,100,200,500,1000,2000,5000,10000,20000,50000,100000,200000,500000,1000000,2000000,5000000,10000000,20000000],
    defaultGetCoinByEatFish: [1,2,5,10,20,50,100,200,500,1000,2000,5000,10000,20000,50000,100000,200000,500000,1000000,2000000],

    fishCounts: 20,

    init(callback) {
        // on loading init user data
        T.rGet('getUserDataById',{
            id: T.id,
        },(res)=>{
            console.log('id',T.id)
            console.log('请求的数据',res)
            if(callback) {
                callback()
            }
        })
    },

    getEnemyData() {
        let data = T.defaultEnemyData
        T.incrementUserData.coin_dt = data.coin
        return data
    },

    getUserInfo() {
        return T.defaultUserData
    },

    _calcUserData() {
        let data = T.defaultUserData
        let data_dt = T.incrementUserData
        data.coin += data_dt.coin_dt
        data.energy -= data_dt.energy_dt
        data.level += data_dt.level_dt
    },

    touchOnce() {
        T._calcUserData()
        T.updateUsrInfo()
    },

    updateUsrInfo() {
        let data = T.getUserInfo()
        KUN.UserData.setCoin(data.coin)
        KUN.UserData.setLevel(data.level)
        KUN.UserData.setEnergy(data.energy)
        KUN.UserData.setFishIndex(data.fishIndex)
    },

    getFishPrice() {
        return T.defaultFishPriceData
    },

    checkIsCanPlay() {
        if(T.defaultUserData.energy - 1 <= -1) {
            return false
        }
        return true
    },

    uploadUserData() {
        // to do
    },

    purchaseNewFish(price) {
        // to do
        if(T.defaultUserData.coin >= price) {
            T.defaultUserData.coin -=price
            T.defaultUserData.level ++
            T.defaultUserData.fishIndex ++
            T.defaultUserData.zoom -= T.defaultUserData.zoom_dt
            T.updateUsrInfo()
            return true
        } else {
            return false
        }
    },

    // require
    rGet(method, reqData, success){
        KUN.GameTools.httpGet(T.subAddress+method,reqData,(res)=>{
            if(success) {
                success(res)
            }
        })
    }
}

export default T;