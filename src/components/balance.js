import { Card, CardContent, Typography, CardActionArea } from '@material-ui/core'
import React from 'react'

import { makeStyles, useTheme } from '@material-ui/core/styles';

import {currentNetwork} from '../store/atoms'
import { useRecoilState, useRecoilValue } from 'recoil';

import { ConnectionContext } from '../providers/connection-context';

import { refreshCalled, currentWallet } from '../store/atoms';

const useStyles = makeStyles(() => ({
  longText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));

export default function Balance({children}) {
  const classes = useStyles( );

  const [refreshVal] = useRecoilState(refreshCalled);
  const [wallet, setWallet] = useRecoilState(currentWallet);

  const selNetwork = useRecoilValue(currentNetwork);

  const {web3} = React.useContext(ConnectionContext);

  const formatBal = (amount) => {
    const precision = 18;
    return amount / Math.pow(10, precision)
  }

  React.useEffect( async () => {
    const bal = await web3.eth.getBalance(wallet.address)
    const wal = {...wallet, balance: bal, formatted: formatBal(bal)  };
    setWallet(wal);
  }, [selNetwork, refreshVal]);

  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography variant="caption" >ACCOUNT BALANCE</Typography>
          <Typography variant="h3" color="primary">{wallet.formatted}</Typography>
          <Typography variant="h6" color="primary">BNB</Typography>

          <Typography variant="caption" >ADDRESS</Typography>
          <Typography variant="subtitle2" color="primary" className={classes.longText} >{wallet.address}</Typography>
        </CardContent>
      </CardActionArea>
      {children}
    </Card>
  )
}