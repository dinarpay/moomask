export default {
    namespaced: true,

    state: {
        id: 1,
        name: 'Mainnet',
        main: 'https://bsc-dataseed1.binance.org:443',
        scan: 'https://api.bscscan.com/api',
        type: 'mainnet',
        explore: 'https://bscscan.com',
        apiKey: ''
    },

    mutations: {
        change(state, network) {
            state.id = network.id
            state.name = network.name
            state.main = network.main
            state.type = network.type
            state.scan = network.scan
            state.apiKey = network.apiKey
            state.explore = network.explore
        }
    }
}
