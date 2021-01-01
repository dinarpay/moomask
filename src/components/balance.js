import { Card, CardContent, Typography, CardActionArea } from '@material-ui/core'
import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import { useRecoilValue } from 'recoil';


import { currentWallet, currentBalanceFormatted } from '../store/atoms';


const useStyles = makeStyles(() => ({
  longText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));

export default function Balance({children}) {
  const classes = useStyles( );

  const precision = 18;
  const defaultToken = 'bnb';

  const wallet = useRecoilValue(currentWallet);
  const balance = useRecoilValue(currentBalanceFormatted({token: defaultToken, precision}));
  
  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography variant="caption" >ACCOUNT BALANCE</Typography>
          <Typography variant="h3" color="primary">{balance}</Typography>
          <Typography variant="h6" color="primary">BNB</Typography>

          <Typography variant="caption" >ADDRESS</Typography>
          <Typography variant="subtitle2" color="primary" className={classes.longText} >{wallet.address}</Typography>
        </CardContent>
      </CardActionArea>
      {children}
    </Card>
  )
}