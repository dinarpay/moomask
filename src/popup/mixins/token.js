
import { mapState } from 'vuex'
import { getTokenAmount } from '../../lib/utils'

import ALL_TOKENS from '../../all_tokens'
import token from '../store/modules/token'

export default {
    computed: mapState({
        token: state => state.token.tokens 
    }),

    methods: {
        getTokenAmount,

        async loadTokenData() {
            
            const token = await this.getTokenData() 
            this.$store.commit('token/tokens', token) 

        },

        async getTokenData() {
            let tokens = {}

            const single = 'BNB;BNB;18';
            tokens['1'] = single;

            for(let i = 0; i < ALL_TOKENS.length; i++) {
                const at = ALL_TOKENS[i];
                tokens[at.id.toString()] = `${at.code};${at.code};${at.decimals}`;
            }
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
