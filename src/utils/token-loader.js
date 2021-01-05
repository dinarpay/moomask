import Web3 from 'web3';

export const ABI = [{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];

export const loadSingle = async (network, contractAddress, ownAddress) => {
  let provider = new Web3( new Web3.providers.HttpProvider(network.main) );
  
  let contract = new provider.eth.Contract( ABI , contractAddress )
  const balResult = await contract.methods.balanceOf(ownAddress).call();
  return balResult;
}