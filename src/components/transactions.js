import React from 'react';

import { currentNetwork, currentWallet, networkTransactions } from '../store/atoms'
import {  useRecoilValue } from 'recoil';

import {ButtonBase} from '@material-ui/core';

import { FixedSizeList } from 'react-window';
import { ArrowDownward, ArrowUpward } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ALL_TOKENS, { DEFAULT_TOKEN } from '../config/tokens'
import { precisionFormat, formatDateFromSeconds} from '../utils/format-utils';

const useStyles = makeStyles((theme) => ({
  root: {
    width:'100%',
    height:'100%'
  },
  listItem: {
    width:'100%',
    display:'flex'
  },
  icon: {
    justifyContent: 'center',
    fontWeight: 'bold',
    width: '10%',
  },
  moneyGone: {
    color: 'red'
  },
  moneyAdd: {
    color: 'green'
  },
  contentArea: {
    width:'90%',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)'
  }
}));


export default function Transactions() {

  const classes = useStyles( );

  const wallet = useRecoilValue(currentWallet);
  const network = useRecoilValue(currentNetwork);
  const transactions = useRecoilValue(networkTransactions(0));

  const formatDate = (dt) => {
    return new Date(dt * 1000).toUTCString();
  }

  const ALL_TOKENS_MAP = React.useMemo(() => {
    let mp = {};
    ALL_TOKENS.forEach((item) => {
      let {contract} = item;
      if(contract && contract[network.id]) {
        mp[contract[network.id].toUpperCase()] = item;
      }
    });
    return mp;
  }, [ALL_TOKENS, network])

  const renderRow = (props) => {
    const { index, style } = props;
    const di = transactions[index];
    const isSend = wallet.address.toUpperCase() == di.from.toUpperCase();

    const tokenValue = di.contractAddress && ALL_TOKENS_MAP[di.contractAddress.toUpperCase()] ? ALL_TOKENS_MAP[di.contractAddress.toUpperCase()] : DEFAULT_TOKEN;

    return (
        <div style={style} key={index} >
          <ButtonBase className={classes.root}>
            <div className={classes.listItem}>
              <div className={classes.icon}>
                {isSend ? <ArrowUpward className={classes.moneyGone} /> : <ArrowDownward className={classes.moneyAdd} />}
              </div>
            <div className={classes.contentArea}>
              <Typography component="body1">{isSend ? 'Sent' : 'Received'}</Typography>
              <span className={classes.amount}>{ precisionFormat(tokenValue.decimals)(di.value, 4) } {tokenValue.code}</span>
              <Typography component="caption">{ formatDateFromSeconds(di.timeStamp) }</Typography>

            </div>
            </div>
          </ButtonBase>
        </div>
    );
  }
  
  return (
    <FixedSizeList height={500} width={'100%'} itemSize={70} itemCount={transactions.length}>
      {renderRow}
    </FixedSizeList>
  )
}