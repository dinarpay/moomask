import React, { useMemo } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil';
import {currentNetwork, selectedNetworkId} from '../store/atoms'

import Web3 from 'web3'

export const ConnectionContext = React.createContext()

function ConnectionProvider({children}) {
  const selNetworkId = useRecoilState(selectedNetworkId);
  const selNetwork = useRecoilValue(currentNetwork)
  
  const web3 = useMemo(() => {
    return new Web3( new Web3.providers.HttpProvider(selNetwork.main) );
  }, [selNetwork]);

  return (
    <ConnectionContext.Provider value={{
      networkId: selNetworkId,
      web3: web3
    }}>
        {children}
    </ConnectionContext.Provider>
  )
}

export default ConnectionProvider;