<template>
     <div class="auth">
             <header class="header">
        <div class="header-top">

            <div class="network" v-click-outside="hideNetworkDropdown">
                <a href="#" class="network-toggle" @click.prevent="toggleNetworkDropdown">
                    <span class="network-icon"><svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 20a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm7.75-8a8.01 8.01 0 0 0 0-4h-3.82a28.81 28.81 0 0 1 0 4h3.82zm-.82 2h-3.22a14.44 14.44 0 0 1-.95 3.51A8.03 8.03 0 0 0 16.93 14zm-8.85-2h3.84a24.61 24.61 0 0 0 0-4H8.08a24.61 24.61 0 0 0 0 4zm.25 2c.41 2.4 1.13 4 1.67 4s1.26-1.6 1.67-4H8.33zm-6.08-2h3.82a28.81 28.81 0 0 1 0-4H2.25a8.01 8.01 0 0 0 0 4zm.82 2a8.03 8.03 0 0 0 4.17 3.51c-.42-.96-.74-2.16-.95-3.51H3.07zm13.86-8a8.03 8.03 0 0 0-4.17-3.51c.42.96.74 2.16.95 3.51h3.22zm-8.6 0h3.34c-.41-2.4-1.13-4-1.67-4S8.74 3.6 8.33 6zM3.07 6h3.22c.2-1.35.53-2.55.95-3.51A8.03 8.03 0 0 0 3.07 6z" /></svg></span>

                    <span class="network-name">{{ currentNetwork.name }}</span>

                    <span class="network-arrow"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="icon"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></span>
                </a>

                <div class="network-dropdown" v-show="showNetworkDropdown">
                    <a href="#" @click.prevent="changeNetwork(network)" v-for="network in networks" :key="network.id">
                        <span class="network-dropdown-icon">
                            <svg v-if="currentNetwork.id === network.id" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -1.5 24 24" width="24" height="24" preserveAspectRatio="xMinYMin" class="icon"><path d='M10 20.565c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10z' /></svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="24" height="24" preserveAspectRatio="xMinYMin" class="icon"><path d='M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 2C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10z'/></svg>
                        </span>

                        <span>{{ network.name }}</span>
                    </a>
                </div>
            </div>

        </div>
    </header>


        <div class="auth-logo">
            <img src="images/bscpay.png" alt="MooMask">
        </div>

        <h1 class="auth-title">MOOMASK</h1>

        <div v-show="error.show" class="message error">
            {{ error.message }}
        </div>

        <form @submit="submitForm" action="" method="post" class="auth-form" autocomplete="off">
            <input class="input-field" type="text" placeholder="Private Key" v-model="privateKey">
            <input class="input-field" type="password" name="password" placeholder="New Password (min 8 chars)" v-model="password">

            <div class="form-info">
                This password encrypts your private key. Make sure to remember this password as you will need it to unlock your wallet.
            </div>

            <button class="button brand" type="submit">Import Wallet from Private Key</button>
            <a class="auth-link" @click="$router.back()">Cancel</a>
        </form>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { encryptKeyStore } from '../../lib/keystore'
    import Web3 from 'web3';

    export default {
        data: () => ({
            password: '',
            privateKey: '',
            error: {
                show: false,
                message: ''
            },
            showDropdownMenu: false,
            showNetworkDropdown: false,
            selectedNetwork: '',
            networks: []
        }),

        computed: mapState({
            address: state => state.wallet.address,
            keystore: state => state.wallet.keystore,
            currentNetwork: state => state.network
        }),

        methods: {
             toggleDropdownMenu() {
                this.showDropdownMenu = (this.showDropdownMenu) ? false : true
            },

            hideDropdownMenu() {
                this.showDropdownMenu = false
            },

            toggleNetworkDropdown() {
                this.showNetworkDropdown = (this.showNetworkDropdown) ? false : true
            },

            hideNetworkDropdown() {
                this.showNetworkDropdown = false
            },

            changeNetwork(network){
                this.showNetworkDropdown = false
                this.selectedNetwork = network
                this.$store.commit('network/change', network)
            },

            submitForm(e) {
                e.preventDefault()

                if (this.password.length < 8) {
                    this.error.show = true
                    this.error.message = 'Password is not long enough'

                    return false
                }

                const web3 = new Web3( new Web3.providers.HttpProvider(this.selectedNetwork.main) );

                const account = web3.eth.accounts.privateKeyToAccount(this.privateKey)

                const keystore = encryptKeyStore(this.password, this.privateKey, account.address)

                this.$store.commit('wallet/address', account.address)
                this.$store.commit('wallet/keypass', this.password)
                this.$store.commit('wallet/keystore', keystore)
                this.$router.push('/')
            }
        }
    }
</script>
