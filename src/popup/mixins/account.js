import { mapState } from 'vuex'
import { getTokenAmount } from '../../lib/utils'
import ALL_TOKENS from '../../all_tokens'
import token from './token'

import Web3 from 'web3'
import network from '../store/modules/network'

export const ABI = [
    {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_spender",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_from",
                "type": "address"
            },
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "name": "",
                "type": "uint8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "name": "balance",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_to",
                "type": "address"
            },
            {
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "_owner",
                "type": "address"
            },
            {
                "name": "_spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    }
];

export const loadSingle = async (network, contractAddress, ownAddress) => {
  let provider = new Web3( new Web3.providers.HttpProvider(network.main) );
  
  let contract = new provider.eth.Contract( ABI , contractAddress )
  const balResult = await contract.methods.balanceOf(ownAddress).call();
  return balResult;
}

export const transferToAddresss = async (network, wallet, contractAddress, ownAddress, destAddress, amount) => {
    let provider = new Web3( new Web3.providers.HttpProvider(network.main) );
    let contract = new provider.eth.Contract( ABI , contractAddress )
    const nonceCount = await provider.eth.getTransactionCount(ownAddress);
    console.log(`None count ${nonceCount}`);
    const balance = await contract.methods.balanceOf(ownAddress).call();
    const gasPrice = await provider.eth.getGasPrice()
    console.log(`Balance before send: ${balance}`);
    try {
        if(balance > amount) {
            console.log('send possible');
            let transferAmount = "0x" + amount.toString(16)

            var rawTransaction = {
                "from": ownAddress,
                "nonce": "0x" + nonceCount.toString(16),
                "gasPrice": gasPrice,
                "gasLimit": "0x250CA",
                "to": contractAddress,
                "value": "0x0",
                "data": contract.methods.transfer(destAddress, transferAmount).encodeABI()
            };
            
            const myAccount = provider.eth.accounts.privateKeyToAccount(wallet.privateKey);
            
            
            const signedTransaction = await myAccount.signTransaction(rawTransaction);
            
            
            const result = await provider.eth.sendSignedTransaction(signedTransaction.rawTransaction);
            return result;
        } 
        return {status: false}
    } catch(e) {
        console.error(e);
    }
    return {status: false}
}

export default {
    mixins: [token],

    computed: mapState({
        account: state => state.account,
        address: state => state.wallet.address,
        network: state => state.network
    }),

    methods: {
        async do20TokenTransfer(wallet, tokenId, toAddress, amount) {
            const nwork = this.network;
            let toUseTokens = ALL_TOKENS.filter( item => {
                return item.id == tokenId && item.contract && item.contract[nwork.id];
            });

            const [single] =  toUseTokens;
            const contractAddress = single.contract[nwork.id];
            
            return await transferToAddresss(nwork, wallet, contractAddress, this.address, toAddress, amount);
        },

        async loadAccount() {
            const web3 = new Web3( new Web3.providers.HttpProvider(this.network.main) )

            const balance = await web3.eth.getBalance(this.address)
            
            let account = {}
            account.balance = getTokenAmount(balance, 18)
            
            const tokens = {'1': {name: '1', precision:18, balance: balance}};

            await this.loadOtherTokens(this.network, tokens, this.address);

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
