import { Card, CardContent, Typography, CardActionArea } from '@material-ui/core'
import React from 'react'

import { makeStyles } from '@material-ui/core/styles';

import { useRecoilValue } from 'recoil';

import { currentWallet, currentBalanceFormatted, tokenList } from '../store/atoms';

import ALL_TOKENS, { DEFAULT_TOKEN } from '../config/tokens';

const useStyles = makeStyles(() => ({
  longText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  }
}));

export default function Balance({children}) {
  const classes = useStyles( );

  const precision = 18;
  
  const wallet = useRecoilValue(currentWallet);

  const balance = useRecoilValue(currentBalanceFormatted({token: DEFAULT_TOKEN, precision}));

  return (
    <Card>
      <CardActionArea>
        <CardContent>
          <Typography variant="caption" >ACCOUNT BALANCE</Typography>
          <Typography variant="h3" color="primary">{balance}</Typography>
          <Typography variant="h6" color="primary">{DEFAULT_TOKEN.code}</Typography>

          <Typography variant="caption" >ADDRESS</Typography>
          <Typography variant="subtitle2" color="primary" className={classes.longText} >{wallet.address}</Typography>
        </CardContent>
      </CardActionArea>
      {children}
    </Card>
  )
}