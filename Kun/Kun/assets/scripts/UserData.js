let T = {
    _coins:0,
    _energy: 50,
    _level: 1,
    _price:[],

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

    setUserData(data) {
        T.setCoin(data.coin)
        T.setEnergy(data.energy)
        T.setLevel(data.level)
    }
}

export default T;