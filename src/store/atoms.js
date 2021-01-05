import {
  atom,
  selector,
  selectorFamily,
  waitForNone
} from 'recoil';

import Web3 from 'web3'

import Networks from '../config/networks'
import { precisionFormat } from '../utils/format-utils'
import { loadSingle} from '../utils/token-loader'
import ALL_TOKENS, { BNB_CODE } from '../config/tokens'

const NetworkMap = {};
Networks.forEach(item => {
  NetworkMap[item.id] = item;
});

export const selectedNetworkId = atom({
  key: 'selectedNetworkId',
  default: 1,
  persistence_UNSTABLE: {
    type: 'selectedNetworkId'
  }
})

export const refreshCalled = atom({
  key: 'refreshCalled',
  default: 0
});

export const currentNetwork = selector({
  key: 'currentNetwork',
  get: ({get}) => {
    const selNet = get(selectedNetworkId)

    if(typeof NetworkMap[selNet] !== 'undefined') {
      return NetworkMap[selNet]
    }

    return null;
  },
  set: ({set}, newValue) => {
    if(typeof NetworkMap[newValue] === 'undefined') {
      throw new Error("Invalid network id")
    }

    set(selectedNetworkId, newValue)
  }
});

export const networkProvider = selector({
  key: 'networkProvider',
  get: ({get}) => {
    var network = get(currentNetwork)
    return new Web3( new Web3.providers.HttpProvider(network.main) );
  }
});

export const currentWallet = atom({
  key: 'currentWallet',
  default: null,
  persistence_UNSTABLE: {
    type: 'currentWallet'
  }
});

export const currentBalance = selectorFamily({
  key: 'currentBalance',
  default: 0,
  persistence_UNSTABLE: {
    type: 'currentBalance'
  },
  get: (token) => async( {get} ) => {
    get(refreshCalled)
    const network = get(currentNetwork);
    const wallet = get(currentWallet);

    const info = await get(tokenLoader({ token: token, network, address: wallet.address }));

    return info.balance;
  }
})

export const currentBalanceFormatted = selectorFamily({
  key: 'currentBalanceFormatted',
  default: 0,
  get: ({token, precision}) => async ({get}) => {
    const amount = await get(currentBalance(token))
    return precisionFormat(precision)(amount);
  }
})

const loadUrl = async ( url ) => {
  try {
    const response = await fetch(url, {
      method: 'GET'
    });
    return response.json();
  } catch(e) {
    throw e;
  }
};

export const networkTransactions = selectorFamily({
  key: 'networkTransactions',
  get: (fromBlock) => async ({get}) => {
    const network = get(currentNetwork);
    const wallet = get(currentWallet);
    get(refreshCalled);
    const startBlock = fromBlock ? fromBlock : 0;

    const fetchUrl = `${network.scan}?module=account&action=txlist&address=${wallet.address}&startblock=${startBlock}&endblock=99999999&apikey=${network.apiKey}`;

    const resp = await loadUrl(fetchUrl);
    if(resp.message === 'OK') {
      return resp.result.reverse();
    }
    return [];
  }
});

export const tokenList = selector({
  key: 'tokenList',
  default: [],
  get: async ({get}) => {
    get(refreshCalled);
    const network = get(currentNetwork);
    const wallet = get(currentWallet);
    
    let toUseTokens = ALL_TOKENS.filter( item => {
      return item.code === BNB_CODE || (item.contract && item.contract[network.id]);
    });

    toUseTokens = toUseTokens.map(item => {
      if(item.code === BNB_CODE) {
        return item;
      }
      const cr = item.contract[network.id]
      return {...item, contract: cr};
    });
    
    const tokenLoadables = get(waitForNone(
      toUseTokens.map(token => tokenLoader({token: token, network, address: wallet.address}))
    ));

    return tokenLoadables
      .filter(({state, contents}) => { 
        return state === 'hasValue' && contents && contents.balance > 0;
      })
      .map(({contents}) => contents);
  }
});

export const tokenLoader = selectorFamily({
  key: 'tokenLoader',
  get: ({token, network, address}) => async ({get}) => {
    if (token.code === BNB_CODE) {
      const wallet = get(currentWallet)
      const web3 = get(networkProvider)
      const bal = await web3.eth.getBalance(wallet.address)
      return {...token, balance: bal};
    }
    const balance = await loadSingle(network, token.contract, address);
    return {...token, balance};
  }
})