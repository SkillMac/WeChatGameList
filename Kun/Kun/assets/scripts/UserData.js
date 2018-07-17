let T = {
    _coins:0,
    _energy: 50,
    _level: 1,
    _price:[],
    _maxEnergy:50,
    _fishIndex:1,

    // func

    setCoin(coin) {
        T._coins = coin
    },

    getCoin() {
        return T._coins
    },

    setEnergy(energy) {
        T._energy = energy
    },

    getEnergy() {
        return T._energy
    },

    setLevel(level) {
        T._level = level
    },

    getLevel() {
        return T._level
    },

    setFishPrice(data){
        T._price =data
    },

    getFishPrice(){
        return T._price
    },

    getMaxEnergy() {
        return T._maxEnergy
    },

    setMaxEnergy(max) {
        T._maxEnergy = max
    },

    setFishIndex(index) {
        T._fishIndex = index
    },

    getFishIndex() {
        return T._fishIndex
    },

    setUserData(data) {
        T.setCoin(data.coin)
        T.setEnergy(data.energy)
        T.setLevel(data.level)
        T.setMaxEnergy(data.maxEnergy)
        T.setFishIndex(data.fishIndex)
    }
}

export default T;