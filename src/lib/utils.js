import store from '../popup/store';

let contractTypes = {}

export const CONTRACT_TYPES = contractTypes

export function getTokenAmount(rawAmount, precision = 6) {
    return rawAmount / Math.pow(10, precision)
}

export function getTokenRawAmount(amount, precision = 6) {
    return amount * Math.pow(10, precision)
}

export function getScanlink() {
    return store.state.network.explore;
}
