import React from 'react'

import {  Button, Container, MenuItem } from '@material-ui/core'
import BackButtonHeader from '../components/back-button-header'

import { makeStyles } from '@material-ui/core/styles';
import {FormControl, TextField, FormHelperText, Select} from '@material-ui/core';

import Header from '../components/header'
import { useRecoilValue } from 'recoil';

import { currentBalanceFormatted, currentBalance, networkProvider, currentWallet } from '../store/atoms'
import { decryptKeyStore } from '../lib/keystore'

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

  const precision = 18;
  const defaultToken = 'bnb';

  const wallet = useRecoilValue( currentWallet );
  const rawBalance = useRecoilValue( currentBalance(defaultToken) );
  const balanceFormatted = useRecoilValue(currentBalanceFormatted( {token: defaultToken, precision} ));

  const provider = useRecoilValue( networkProvider )

  const [errors, setErrors] = React.useState({});
  const [vals, setVals] = React.useState({address: '', token: defaultToken});
  const [helper, setHelper] = React.useState({address: ''})

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const {address, amount, token} = vals;
    
    let hasErrors = false;
    const er = {};
    const msg = {};
    if(!address) {
      er.address = true;
      msg.address = 'Address is required';
      hasErrors = true;
    } else if(!provider.utils.isAddress(er.address)) {
      er.address = true;
      msg.address = 'Invalid address';
      hasErrors = true;
    }

    if(!amount) {
      hasErrors = true;
      er.amount = true;
      msg.amount = 'Add amount to send';
    } else {
      const amountRaw = amount * Math.pow(10, precision);
      if(amountRaw > rawBalance) {
        hasErrors = true;
        er.amount = true;
        msg.amount = 'Insufficient balance';
      }
    }

    if(hasErrors) {
      setErrors(er)
      setHelper(msg)
    } else {
      const unlocked = decryptKeyStore(wallet.password, wallet.keystore)
      if(!unlocked) {
        // show message
        return false;
      }
      const account = provider.eth.accounts.privateKeyToAccount(unlocked.privateKey)

      provider.eth.accounts.wallet.add(account)

      const gasPrice = await provider.eth.getGasPrice()

      const result = await provider.eth.sendTransaction({from: wallet.address,
        to: address, 
        value: amount, 
        gas: 2000000,
        gasPrice: gasPrice});
  
      if (result.status) {
        //TODO success
      } else {
        // failure
      }
    }

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
            <Select id="token" value={vals.token} label="Token" onChange={(e) => 
            setVals(val => { return {...val, token: e.target.value}; })
            }>
              <MenuItem value={'bnb'}>BNB ({balanceFormatted})</MenuItem>
            </Select>
          </FormControl>

          <FormControl error={errors.amount} className={classes.formrow}>
            <TextField id="amount" value={vals.amount} onChange={(e) => 
              setVals(val => { return {...val, amount:e.target.value}; })
            }
              aria-describedby="amount_helper" type="number" label="Amount"/>
            <FormHelperText id="amount_helper">
              {helper.amount}
            </FormHelperText>
          </FormControl>

          <Button variant="contained" color="primary" type="submit">Send</Button>

        </form>
      </Container>
    </>
  )
}