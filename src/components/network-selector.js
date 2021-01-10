import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Networks from '../config/networks'

import Select from '@material-ui/core/Select';
import { useRecoilState } from 'recoil';
import { makeStyles } from '@material-ui/core/styles';
import { selectedNetworkId } from '../store/atoms';


const useStyles = makeStyles((theme) => ({
  menuItem: {
    '& img': {
      width: theme.spacing(2),
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1)
    }
  },
  select: {
    '& .MuiSelect-root': {
      paddingRight: theme.spacing(3),
      paddingLeft: theme.spacing(0)
    },
    '& img': {
      width: theme.spacing(2),
      marginRight: theme.spacing(1),
      marginLeft: theme.spacing(1)
    }
  }
}));


export default function NetworkSelector({className}) {

  const classes = useStyles();
  const [network, setNetwork] = useRecoilState(selectedNetworkId)

  const handleChange = (event) => {
    setNetwork(event.target.value);
  };

  return (
    <Select
      value={network}
      onChange={handleChange}
      className={classes.select}
    >
      {Networks.map((option) => (
        <MenuItem value={option.id} key={option.id} className={classes.menuItem}>
          <img src={option.icon} alt={option.name} />
          {option.name}
        </MenuItem>
      ))}
    </Select>
  )
}