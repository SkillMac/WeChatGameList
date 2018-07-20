let T = {
    id:'',
    subAddress:'AppController/',
    defaultEnemyData:{
        type:'x1',
        level: 1,
        coin: 1,
        flag: 'passBy',
    },

    defaultUserData: {
        coin:0,
        energy:50,
        level:1,
        maxEnergy:50,
        fishIndex:1,
        zoom: 3,
        zoom_dt: 0.125,
    },

    incrementUserData: {
        coin_dt: 1,
        energy_dt: -1,
        level_dt: 0,
    },

    defaultFishPriceData: [0,20,50,100,200,500,1000,2000,5000,10000,20000,50000,100000,200000,500000,1000000,2000000,5000000,10000000,20000000],

    fishCounts: 20,

    init(callback) {
        // on loading init user data
        T.rGet('getUserDataById',{
            id: T.id,
        },(res)=>{
            this.initUserData(res,true)
            if(callback) {
                callback()
            }
        })
    },

    initUserData(data,isLogin)
    {
        // init usr data
        let usr = T.defaultUserData
        usr.coin = Number(data.coin)
        usr.energy = Number(data.energy)
        usr.level = Number(data.level)
        usr.maxEnergy = Number(data.maxEnergy)
        usr.fishIndex = Number(data.fishIndex)
        usr.zoom = Number(data.zoom)
        usr.zoom_dt = Number(data.zoom_dt)

        // console.log('更新数据',isLogin,data)
        // init fish price
        if(isLogin) {
            T.defaultFishPriceData = data.fishPrice
        }
    },

    rEnemyData(callback){
        T.rGet('buildNewFish',{
            id: T.id,
        },(res)=>{
            this.updateEnemyData(res)
            if(callback) {
                callback()
            }
        })
    },

    updateEnemyData(data)
    {
        console.log('新敌人的数据',data)
        let ed = T.defaultEnemyData
        ed.level = Number(data.level)
        ed.coin = Number(data.coast_coin)
        ed.type = data.fish_index
        ed.flag = data.flag
        T.incrementUserData.energy_dt = Number(data.user.coast_energy)
        T.incrementUserData.coin_dt = Number(ed.coin)
        T.initUserData(data.user)
    },

    rFinishEat(callback) {
        T.rGet('finishEat',{
            id: T.id,
        },(res)=>{
            console.log('吃鱼结束',res)
            this.initUserData(res)
            if(callback) {
                callback()
            }
        })
    },

    rFlee(callback) {
        T.rGet('flee',{
            id: T.id,
        },(res)=>{
            this.initUserData(res)
            if(callback) {
                callback()
            }
        })
    },

    rflockEnergy(callback)
    {
        T.rGet('flockEnergy',{
            id: T.id,
        },(res)=>{
            let result = T.dealFlockEnergyData(res)
            console.log('收集能',res, result)
            if(callback) {
                callback(result)
            }
        })
    },

    dealFlockEnergyData(data) {
        if(typeof(data) == 'number') {
            // 开始倒计时
            return {status:'1',time:data}
        } else if(typeof(data) == 'object'){
            // 收集能量
            T.initUserData(data)
            return {status:'2'}
        }
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
        data.energy += data_dt.energy_dt
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