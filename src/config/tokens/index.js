const BTCB = require('./btcb.json');
const  BURGER = require('./burger.json');
const  BUSD = require('./busd.json');
const  ETH = require('./eth.json');
const  LTC = require('./ltc.json');
const  PROM = require('./prom.json');
const  VENUS = require('./venus.json');
const  WBNB = require('./wbnb.json');
const XRP = require('./xrp.json')

const BNB = require('./bnb.json')

const ALL_TOKENS = [BNB, BTCB, BURGER, BUSD, ETH, LTC, PROM, VENUS, WBNB, XRP];

export const BNB_CODE = 'BNB';
export const DEFAULT_TOKEN = BNB;

export default ALL_TOKENS;

export const genTokenMap = (network) => {
  const mp = {}
  ALL_TOKENS.forEach((item) => {
    let {contract} = item;
    if(contract && contract[network.id]) {
      mp[contract[network.id].toUpperCase()] = item;
    }
  });
  return mp;
}

