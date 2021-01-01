import {
  atom,
  selector,
  selectorFamily
} from 'recoil';

import Web3 from 'web3'

import Networks from '../config/networks'
import { precisionFormat, formatAmount } from '../lib/format-utils'

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
    const network = get(currentNetwork)
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
  get: (token) => async( {get, set} ) => {
    get(refreshCalled)
    const wallet = get(currentWallet)
    const web3 = get(networkProvider)
    const balance = await web3.eth.getBalance(wallet.address)

    return balance;
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
    if(resp.message == 'OK') {
      console.log(resp.result)
      return resp.result;
    }
    return [];
  }
});
