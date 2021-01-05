<template>
    <div>
        <app-header @refresh="refreshAccount" />

        <main class="main">
            <div v-if="currentNetwork.type === 'testnet'" class="free-tokens">
                <a href="https://testnet.binance.org/faucet-smart" target="_blank">Click here</a> to get some free tokens.
            </div>
            <div v-if="account.tokens.length === 0" class="message-empty">
                No tokens found
            </div>

            <div v-else>
                <div class="token" v-for="token in account.tokens" :key="token.name" v-show="token.name !== '_'">
                    <img :src="`tokens/${getTokenDetails(token.name)[1].toLowerCase()}.webp`" />
                    <span class="token-name">{{ getTokenDetails(token.name)[1] }}</span> 
                    <span class="token-balance">{{ $formatNumber(getTokenAmount(token.balance, getTokenDetails(token.name)[2]), { maximumSignificantDigits: parseInt(getTokenDetails(token.name)[2]) + 1 }) }}</span> 
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import account from '../mixins/account'
    import AppHeader from '../components/AppHeader.vue'
    import { mapState } from 'vuex'

    export default {
        computed: mapState({
            address: state => state.wallet.address,
            currentNetwork: state => state.network
        }),

        mixins: [account],

        components: {
            AppHeader
        },

        mounted() {
            if (this.account.tokens.length === 0) {
                this.loadAccount()
            }
        }
    }
</script>

<style>
    .free-tokens {
        font-size: 14px;
        padding-bottom: 14px;
    }
    .token {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        background: #FFFFFF;
        border-radius: 5px;
        padding: 1rem;
        margin-bottom: 0.75rem;
    }
    .token img {
        max-width:32px;
        margin-right: 8px;
    }
    .token span {
        display: block;
    }
    .token-name {
        color: #9E9E9E;
        font-size: 0.875rem;
        flex:1;
    }
    .token-balance {
        font-size: 1rem;
        font-weight: 600;
        text-align: right;
        word-break: break-all;
        padding-left: 1rem;
    }
</style>

