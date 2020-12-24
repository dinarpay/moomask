
import { mapState } from 'vuex'
import { getTokenAmount } from '../../lib/utils'

export default {
    computed: mapState({
        token: state => state.token.tokens 
    }),

    methods: {
        getTokenAmount,

        async loadTokenData() {
            
            //const tokenData = await API().getTokens({ showAll: 1, limit: 1 })

            //if (tokenData.total > Object.keys(this.token).length) {
                const token = await this.getTokenData() 
                
                this.$store.commit('token/tokens', token) 
            //}
        },

        async getTokenData() {
            let tokens = {}
            /*const data = await API().getTokens({ showAll: 1, limit: 4000 })

            for (var i = 0; i < data.tokens.length; i++) {
                if (!tokens[data.tokens[i].id]) {
                    tokens[data.tokens[i].id] = data.tokens[i].name + ';' + data.tokens[i].abbr + ';' + data.tokens[i].precision
                }
            }*/

            const single = 'BNB;BNB;18';
            tokens['1'] = single;

            return tokens
        },

        getTokenDetails(tokenId) { 
            if (this.token[tokenId] == undefined) {
                return ['TOKEN', 'TOKEN', '0']
            }

            return this.token[tokenId].split(';')
        }
    }
}
