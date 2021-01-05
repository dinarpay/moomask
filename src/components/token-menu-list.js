import React from 'react'
import { MenuItem, Select } from '@material-ui/core'

import { useRecoilValue } from 'recoil';
import { precisionFormat } from '../utils/format-utils'

import { tokenList } from '../store/atoms'

export default function TokenMenuItems({value, setValue}) {

  const tokenListItems = useRecoilValue(tokenList);

  const handleSetValue = (e) => {
    let [selected] = tokenListItems;

    for( let i = 0; i < tokenListItems.length; i++) {
      const single = tokenListItems[i];
      if(single.code === e.target.value) {
        selected = single;
      }
    }
    setValue(val => { 
      return {...val, token: selected}; 
    })
  }

  return (
    <Select id="token" value={value.code} label="Token" 
      onChange={handleSetValue}>
    {tokenListItems.map((item) => {
      return <MenuItem key={item.code} value={item.code}>{precisionFormat(item.decimals)(item.balance)} {item.code}</MenuItem>
    })}
  </Select>)
}