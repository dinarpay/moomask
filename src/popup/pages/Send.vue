<template>
    <div>
        <app-header subtitle="Send Payment" @refresh="refreshTokens" />

        <main class="main">
            <form @submit.prevent="showConfirmDialog" action="" method="post" class="auth-form" autocomplete="off">
                <div v-show="message.show" class="message" :class="[ message.type ]">
                    {{ message.text }}
                </div>

                <label class="input-label">
                    Receipient Address
                    <input class="input-field" type="text" name="address" v-model="receipient">
                </label>

                <label class="input-label">
                    Token
                    <select class="input-field" v-model="selectedToken">
                        <option v-for="token in account.tokens" :key="token.name" :value="token">
                            {{ getTokenName(token) }} ({{ getTokenBalance(token) }} available)
                        </option>
                    </select>
                </label>

                <label class="input-label">
                    Amount
                    <input class="input-field" type="number" name="amount" v-model="amount" step="any">
                </label>


                <button class="button brand" type="submit">Send</button>
            </form>
        </main>

        <confirm-dialog :text="confirmDialogText" ref="confirmDialog" @confirmed="sendPayment" />
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { decryptKeyStore } from '../../lib/keystore'
    import { getTokenRawAmount } from '../../lib/utils'
    
    import API from '../../lib/api'
    import account from '../mixins/account'
    import AppHeader from '../components/AppHeader.vue'
    import ConfirmDialog from '../components/ConfirmDialog.vue'

    import Web3 from 'web3'

    export default {
        mixins: [account],

        components: {
            AppHeader,
            ConfirmDialog
        },

        data: () => ({
            amount: 0,
            receipient: '',
            selectedToken: false,
            message: {
                show: false,
                type: 'error',
                text: ''
            }
        }),

        computed: {
            confirmDialogText() {
                return `
                    Are you sure you want to transfer
                    <div><strong>${this.amount} ${this.getTokenName(this.selectedToken)}</strong></div>
                    <div>to</div>
                    <div><strong>${this.receipient}</strong> ?</div>
                `
            },
            ...mapState({
                wallet: state => state.wallet,
                network: state => state.network,
                transactions: state => state.account.transactions
            })
        },

        mounted() {
            this.setSelectedToken()
            if (this.account.tokens.length === 0) {
                this.loadTokens()
            }
        },


        methods: {
            setSelectedToken() {
                if (this.account.tokens.length > 0) {
                    this.selectedToken = this.account.tokens[0]
                }
            },

            async loadTokens() {
                await this.loadAccount()
                this.setSelectedToken()
                this.$store.commit('loading', false)
            },

            async sendPayment() {
                const wallet = decryptKeyStore(this.wallet.keypass, this.wallet.keystore)
                
                if (!wallet) {
                    this.message.show = true
                    this.message.type = 'error'
                    this.message.text = 'Something went wrong while trying to send the payment'

                    return false
                }

                this.$store.commit('loading', true)

                let amount = this.amount

                if (this.selectedToken.name === "_") {
                    amount = getTokenRawAmount(this.amount)
                }else {
                    amount = getTokenRawAmount(this.amount, this.getTokenDetails(this.selectedToken.name)[2])
                }

                console.log(this.selectedToken);
                console.log(this.getTokenDetails(this.selectedToken.name));

                try {
                    const web3 = new Web3( new Web3.providers.HttpProvider(this.network.main) )
                    const pAccount = web3.eth.accounts.privateKeyToAccount(wallet.privateKey)
                    
                    web3.eth.accounts.wallet.add(pAccount)

                    let result = {};

                    if(this.selectedToken.name !== "1") {
                        result = await this.do20TokenTransfer(wallet, this.selectedToken.name,  this.receipient, amount);
                    } else {
                        const gasPrice = await web3.eth.getGasPrice()
                        result = await web3.eth.sendTransaction({from: wallet.address,
                            to: this.receipient, 
                            value:amount, 
                            gas: 2000000,
                            gasPrice: gasPrice});
                    
                    }
                    
                    this.$store.commit('loading', false)

                    this.message.show = true

                    if (result.status) {
                        this.message.type = 'success'
                        this.message.text = 'Payment has been successfully sent'
                    } else {
                        this.message.type = 'error'
                        this.message.text = result.message
                    }

                    this.loadTokens()
                    this.receipient = ''
                    this.amount = 0
                } catch (e) {
                    console.error(e)
                    this.$store.commit('loading', false)

                    this.message.show = true
                    this.message.type = 'error'
                    this.message.text = 'Something went wrong while trying to send the payment'
                }
            },

            showConfirmDialog(){
                this.message.show = false

                if (!Web3.utils.isAddress(this.receipient)) {
                    this.message.show = true
                    this.message.type = 'error'
                    this.message.text = 'Invalid recipient address'

                    return false
                }

                if (!this.selectedToken) {
                    this.message.show = true
                    this.message.type = 'error'
                    this.message.text = 'Please select token that you want to send'

                    return false
                }

                let precision = 6

                if (this.selectedToken.name !== '_') {
                    precision = parseInt(this.getTokenDetails(this.selectedToken.name)[2])
                }

                if (this.amount > this.selectedToken.balance) {
                    this.message.show = true
                    this.message.type = 'error'
                    this.message.text = 'Insufficient funds'

                    return false
                }

                if (this.amount <= 0) {
                    this.message.show = true
                    this.message.type = 'error'
                    this.message.text = 'Invalid token amount'

                    return false
                }

                this.$refs.confirmDialog.showDialog()
            },

            refreshTokens() {
                this.message.show = false
                this.$store.commit('loading', true)
                this.loadTokens()
            },

            getTokenName(token) {
                if (token.name === '_') {
                    return 'BNB'
                }

                return this.getTokenDetails(token.name)[1]
            },

            getTokenBalance(token) {
                let precision = 6

                if (token.name !== '_') {
                    precision = parseInt(this.getTokenDetails(token.name)[2])
                }
                //return token.balance;
                return this.$formatNumber(this.getTokenAmount(token.balance, precision), { maximumSignificantDigits: precision + 1 })
            }
        }
    }
</script>
