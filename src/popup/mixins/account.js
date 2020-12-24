import { mapState } from 'vuex'
import { getTokenAmount } from '../../lib/utils'
import token from './token'

import Web3 from 'web3'

export default {
    mixins: [token],

    computed: mapState({
        account: state => state.account,
        address: state => state.wallet.address,
        network: state => state.network
    }),

    methods: {
        async loadAccount() {
            const web3 = new Web3( new Web3.providers.HttpProvider(this.network.main) )

            const balance = await web3.eth.getBalance(this.address)
            
            let account = {}
            account.balance = getTokenAmount(balance, 18)
            
            const tokens = {'1': {name: '1', precision:18, balance: balance}};

            this.$store.commit('account/change', account)
            this.$store.commit('account/tokens', tokens)

            await this.loadTokenData()
        },

        async refreshAccount() {
            this.$store.commit('loading', true)
            await this.loadAccount()
            this.$store.commit('loading', false)
        },
    }
}
