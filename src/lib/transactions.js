async function readBlock(eth, blockNumber, address) {
  try {
    const block = await eth.getBlock(blockNumber, true);
    if(block && block.transactions) {
      const transactions = block.transactions;
      for(let i = 0;i < transactions.length; i++) {
        const single = transactions[i];
        if (address == "*" || address == e.from || address == e.to) { 
          console.log('>--------------->');
          console.log(single);
        }
      }
    }
  } catch(e) {
    console.error(e)
  }
}

const loadUrl = async ( url ) => {
  try {
    const response = await fetch(url, {
      method: 'GET'
    });
    return response.json();
  } catch(e) {
    throw e;
  }
}

async function getTransactionsByAccount(network, address, fromBlockNumber) {

  const startBlock = fromBlockNumber ? fromBlockNumber : 0;
  const fetchUrl = `${network.scan}?module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=99999999&apikey=${network.apiKey}`;

  const resp = await loadUrl(fetchUrl);
  if(resp.message == 'OK') {
    console.log(resp.result)
    return resp.result;
  }
  return [];
}



export default getTransactionsByAccount;