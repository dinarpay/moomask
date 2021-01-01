import React from 'react';
import { useHistory } from 'react-router-dom'

import {Button, Box, TextField} from '@material-ui/core';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Header from '../components/header';


const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    padding:theme.spacing(2)
  },
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  fieldPassword: {
    marginBottom: theme.spacing(2)
  },
  formButton: {
    marginBottom: theme.spacing(2)
  },
  links: {
    width:'100%',
    display: 'block',
    marginTop: theme.spacing(2)
  }

}));


export default function Signin() {

  const classes = useStyles( useTheme() );

  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    return false;
  }

  return(
    <>
      <Header loggedIn={false} />
      <Box className={classes.root}>
        <div className="auth-logo">
          <img src="images/bscpay.png" alt="MooMask" />
        </div>

        <h1 className="auth-title">MOOMASK</h1>

        <div className="message error"></div>
        <form method="post" autoComplete="off" onSubmit={handleSubmit} className={classes.form}>
        
          <TextField className={classes.fieldPassword} id="password" aria-describedby="password_helper" type="password" placeholder="Password"/>
            
          <Button variant="contained" color="primary" type="submit" className={classes.formButton}>SignIn</Button>
          <div className="line-through">
            <span>or</span>
          </div>

        </form>
        
        <Button onClick={() => history.push('/create-wallet')} variant="contained" color="default" className={classes.links} >Create New Wallet</Button>
        <Button onClick={() => history.push('/import-wallet')} variant="contained" color="default" className={classes.links}  >Import Wallet from Private Key</Button>
      </Box>
    </>
    )
}