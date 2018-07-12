let T = {
    _coins:0,
    _energy: 50,
    _level: 1,

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
}

export default T;