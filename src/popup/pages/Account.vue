<template>
    <div>
        <app-header @refresh="refreshAccount" />

        <main class="main">
            <div v-if="currentNetwork.type === 'testnet'" class="free-tokens">
                <a href="https://testnet.binance.org/faucet-smart" target="_blank">Click here</a> to get some free tokens.
            </div>

            <div class="box highlight">
                <div class="box-label">Account Balance</div>

                <div class="box-balance">{{ $formatNumber(account.balance, { maximumSignificantDigits: 7 }) }}</div>
                <div class="box-balance-code">BNB</div>

                <div class="box-address-label">Address</div>
                <div class="box-address">{{ address }}</div>

                <div class="box-buttons">
                    <router-link class="green" to="/receive"><span>Receive</span></router-link>
                    <router-link class="red" to="/send"><span>Send</span></router-link>
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
        mixins: [account],

        components: {
            AppHeader
        },

        computed: mapState({
            address: state => state.wallet.address,
            currentNetwork: state => state.network
        }),

        mounted() {
            this.loadAccount()
        }
    }
</script>

<style>
    .free-tokens {
        font-size: 14px;
        padding-bottom: 14px;
    }
</style>
