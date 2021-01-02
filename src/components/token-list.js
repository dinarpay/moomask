import React from 'react';
import { useRecoilValue } from 'recoil';
import { tokenList } from '../store/atoms';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { FixedSizeList } from 'react-window';
import { Avatar, ListItemAvatar } from '@material-ui/core';

export default function TokenList() {
  const list = useRecoilValue(tokenList);

  const formatBal = (amount, precision) => {
    return amount / Math.pow(10, precision);
  }

  const renderRow = (props) => {
    const { index, style } = props;
    const di = list[index];

    return (
      <ListItem style={style} key={index} disableGutters className="trans-list">
        <ListItemAvatar>
          <Avatar alt={di.title} src={`/tokens/${di.icon}`} />
        </ListItemAvatar>
        <ListItemText primary={`${formatBal(di.balance, di.decimals)} ${di.code}`} secondary={di.title} />
      </ListItem>
    );
  }

  return (<FixedSizeList height={500} width={'100%'} itemSize={70} itemCount={list.length}>
    {renderRow}
  </FixedSizeList>
  )  
}