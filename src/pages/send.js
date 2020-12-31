import React from 'react'

import {  Button, Container, MenuItem, Typography } from '@material-ui/core'
import BackButtonHeader from '../components/back-button-header'

import { makeStyles, useTheme } from '@material-ui/core/styles';
import {FormControl, TextField, FormHelperText, Select} from '@material-ui/core';

import Header from '../components/header'
import { useRecoilValue } from 'recoil';

import { currentWallet } from '../store/atoms'

const useStyles = makeStyles((theme) => ({
  root: {
    padding:theme.spacing(2),
    flex:1,
    display: 'flex',
    flexDirection: 'column'
  },
  bottomSpace: {
    marginBottom: theme.spacing(2)
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  formrow: {
    marginBottom: theme.spacing(2)
  }

}));

export default function Send() {
  const classes = useStyles( );

  const wallet = useRecoilValue(currentWallet);

  const [errors, setErrors] = React.useState({});
  const [vals, setVals] = React.useState({address: '', token: 'bnb'});
  const [helper, setHelper] = React.useState({address: ''})

  const handleSubmit = (e) =>{
    e.preventDefault();

    return false;
  }

  return (
    <>
      <Header loggedIn={true}>
        <BackButtonHeader title="Send" />
      </Header>
      <Container className={classes.root}>
      
        <form method="post" autoComplete="off" onSubmit={handleSubmit} className={classes.form}>

          <FormControl  error={errors.address} className={classes.formrow}>
            <TextField id="address" value={vals.address} onChange={(e) => 
              setVals(val => { return {...val, address:e.target.value}; })
            }
              aria-describedby="address_helper" type="text" label="Receipient Address"/>
            <FormHelperText id="address_helper">
              {helper.address}
            </FormHelperText>
          </FormControl>

          <FormControl error={errors.token} className={classes.formrow}>
            <Select id="token" value={vals.token} label="Token">
              <MenuItem value={'bnb'}>BNB ({wallet.formatted})</MenuItem>
            </Select>
          </FormControl>

          <FormControl error={errors.amount} className={classes.formrow}>
            <TextField id="amount" value={vals.amount} onChange={(e) => 
              setVals(val => { return {...val, amount:e.target.value}; })
            }
              aria-describedby="amount_helper" type="number" label="Amount"/>
            <FormHelperText id="amount_helper">
              {helper.address}
            </FormHelperText>
          </FormControl>

          <Button variant="contained" color="primary" >Send</Button>


        </form>
      </Container>
    </>
  )
}