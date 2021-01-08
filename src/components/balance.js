import React from 'react'
import { Card, CardContent, Typography, CardActionArea, Box, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { useRecoilValue } from 'recoil';
import Clipboard from 'react-clipboard.js';

import { currentWallet, currentBalanceFormatted } from '../store/atoms';

import { DEFAULT_TOKEN } from '../config/tokens';
import { FileCopyOutlined } from '@material-ui/icons';



const useStyles = makeStyles((theme) => ({
  longText: {
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  addressCopy: {
    display:'flex',
    alignItems: 'center'
  },
  copyButton: {
    padding:theme.spacing(.5),
    marginLeft: theme.spacing(1),
    cursor: 'pointer',
    '& svg': {
      width: theme.spacing(2),
      height: theme.spacing(2)
    }
  },
  clipboard: {
    width: theme.spacing(2.5),
    height:theme.spacing(2.5),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

export default function Balance({children}) {
  const classes = useStyles( );
  
  const wallet = useRecoilValue(currentWallet);

  const balance = useRecoilValue(currentBalanceFormatted({token: DEFAULT_TOKEN}));
  return (
    <Card>
      <CardContent>
        <Typography variant="caption" >ACCOUNT BALANCE</Typography>
        <Typography variant="h3" color="primary">{balance}</Typography>
        <Typography variant="h6" color="primary">{DEFAULT_TOKEN.code}</Typography>

        <Typography variant="caption" >ADDRESS</Typography>
        <div className={classes.addressCopy}>
          <Typography variant="subtitle2" color="primary" className={classes.longText} >{wallet.address}</Typography>
          <IconButton className={classes.copyButton}>
            <Clipboard component="span" className={classes.clipboard} button-href="#" data-clipboard-text={wallet.address}>
              <FileCopyOutlined color="secondary"  />
            </Clipboard>
          </IconButton>
        </div>
      </CardContent>
      {children}
    </Card>
  )
}