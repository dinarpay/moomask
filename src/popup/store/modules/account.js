export default {
    namespaced: true,

    state: {
        balance: 0,
        bandwidth: 0,
        tokens: [],
        transfers: [],
        transactions:[]
    },

    mutations: {
        change(state, account) {
            state.balance = account.balance
            state.bandwidth = account.bandwidth  
        },

        tokens(state, tokens) {
            state.tokens = tokens
        },

        transfers(state, transfers) {
            state.transfers = transfers
        },

        pushTransfers(state, transfers) {
            state.transfers.push(...transfers)
        },

        transactions(state, transactions) {
            state.transactions = transactions
        },

        pushTransactions(state, transactions) {
            state.transactions.push(...transactions)
        }
    }
}
