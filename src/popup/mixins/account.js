import { mapState } from 'vuex'
import { getTokenAmount } from '../../lib/utils'
import ALL_TOKENS from '../../all_tokens'
import token from './token'

import Web3 from 'web3'

export const ABI = [{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

export const loadSingle = async (network, contractAddress, ownAddress) => {
  let provider = new Web3( new Web3.providers.HttpProvider(network.main) );
  
  let contract = new provider.eth.Contract( ABI , contractAddress )
  const balResult = await contract.methods.balanceOf(ownAddress).call();
  return balResult;
}

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

            await this.loadOtherTokens(this.network, tokens, this.address);
            console.log('now tokens')
            console.log(tokens)
            this.$store.commit('account/change', account)
            this.$store.commit('account/tokens', tokens)

            await this.loadTokenData()
        },

        async refreshAccount() {
            this.$store.commit('loading', true)
            await this.loadAccount()
            this.$store.commit('loading', false)
        },

        async loadOtherTokens(network, defaultToken, address) {
            let toUseTokens = ALL_TOKENS.filter( item => {
                return item.contract && item.contract[network.id];
            });
        
            toUseTokens = toUseTokens.map(item => {
                const cr = item.contract[network.id]
                return {...item, contract: cr};
            });
            
            for(let i = 0; i < toUseTokens.length; i++) {
                try {
                    let balance = await loadSingle(network, toUseTokens[i].contract, address)
                    defaultToken[toUseTokens[i].id] = { name: toUseTokens[i].id.toString(), precision: toUseTokens[i].decimals, balance: balance};

                } catch(e) {
                    console.error(e);
                }
            }
            
        }
    }
}
