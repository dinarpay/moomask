import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Networks from '../config/networks'

import Select from '@material-ui/core/Select';
import { useRecoilState } from 'recoil';
import { selectedNetworkId } from '../store/atoms';

export default function NetworkSelector({className}) {
  const [network, setNetwork] = useRecoilState(selectedNetworkId)

  const handleChange = (event) => {
    setNetwork(event.target.value);
  };

  return (
    <Select
      value={network}
      onChange={handleChange}
      className={className}
    >
      {Networks.map((option) => (
        <MenuItem value={option.id} key={option.id}>{option.name}</MenuItem>
      ))}
    </Select>
  )
}