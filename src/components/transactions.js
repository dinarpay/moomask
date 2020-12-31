import React from 'react';

import {currentNetwork, networkTransactions} from '../store/atoms'
import { useRecoilState, useRecoilValue } from 'recoil';

import { refreshCalled, currentWallet } from '../store/atoms';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { FixedSizeList } from 'react-window';

export default function Transactions() {

  const transactions = useRecoilValue(networkTransactions(0));

  const precision = 18;
  const precisionDiv = Math.pow(10, precision);

  const formatBal = (amount) => {
    return amount / precisionDiv;
  }

  const formatDate = (dt) => {
    return new Date(dt * 1000).toLocaleString();
  }

  const renderRow = (props) => {
    const { index, style } = props;
    const di = transactions[index];
    return (
      <ListItem style={style} key={index} disableGutters className="trans-list">
        <ListItemText primary={`${formatBal(di.value)} BNB`} secondary={formatDate(di.timeStamp)} />
        <svg className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M10 0a10 10 0 1 1 0 20 10 10 0 0 1 0-20zM2 10a8 8 0 1 0 16 0 8 8 0 0 0-16 0zm10.54.7L9 14.25l-1.41-1.41L10.4 10 7.6 7.17 9 5.76 13.24 10l-.7.7z"/></svg>
      </ListItem>
    );
  }
  
  return (
    <FixedSizeList height={500} width={'100%'} itemSize={70} itemCount={transactions.length}>
      {renderRow}
    </FixedSizeList>
  )
}