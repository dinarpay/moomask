import React from 'react';

import { Box, Container, Typography, FormControl, TextField, FormHelperText, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import { decryptKeyStore } from '../utils/keystore';

import BackButtonHeader from '../components/back-button-header'
import Header from '../components/header'
import { useRecoilValue } from 'recoil';
import { currentWallet, networkProvider } from '../store/atoms';

import {Alert} from '@material-ui/lab';
import Clipboard from 'react-clipboard.js';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    padding:theme.spacing(2),
    flex:1,
    display: 'flex',
    flexDirection: 'column'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: theme.spacing(2)
  },
  fieldPassword: {
    marginTop: theme.spacing(2)
  },
  formButton: {
    marginTop: theme.spacing(2)
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  important: {
    marginBottom: theme.spacing(2)
  },
  copyGroup: {
    display: 'flex',
    '& textarea': {
      width: '100%',
      border: '1px solid #ccc',
      borderRight: 'none',
      background: '#fafafa',
      borderRadius: '2px 0 0 2px',
      '&:focus': {
        outline: 'none',
        background: '#f3f3f3'
      }
    },
    '& button': {
      cursor: 'pointer',
      width: '50px',
      background: '#f1f1f1',
      border: '1px solid #ccc',
      borderLeft: 'none',
      borderRadius: '0 2px 2px 0',
      '& svg': {
        width: '15px'
      }
    }
  },
  keyInfo: {
    textAlign: 'left'
  }
}))

export default function ExportKey() {
  const classes = useStyles( );

  const [passValid, setPassValid] = React.useState(false);
  const [error, setError] = React.useState();
  const [pass, setPass] = React.useState('');
  const [helperText, setHelperText] = React.useState('');
  const [privateKey, setPrivateKey] = React.useState('');

  const wallet = useRecoilValue(currentWallet);
  const provider = useRecoilValue(networkProvider);

  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();

    if(wallet.password !== pass) {
      setError(true);
      setHelperText('Invalid password');
      setPassValid(false);
      return false;
    }

    setError(false);
    setHelperText('');
    
    try {
      const {privateKey} = decryptKeyStore(provider, wallet.keystore, wallet.password)
      setPrivateKey(privateKey);
      setPassValid(true);
      
      return false;
    } catch(e) {
      console.error(e);
      setPassValid(false);
      setHelperText('Unable to decrypt keystore');
      setError(true);
    }
    

    return false;
  }

  const copyConfirmed = (event) => {
    event.preventDefault();
  
    history.push('/');

    return false;
  }

  return (<>
  <Header loggedIn={true}>
        <BackButtonHeader title="Export Key" />
      </Header>
      <Container className={classes.root}>

        {
        !passValid && 
          <form method="post" autoComplete="off" onSubmit={handleSubmit} className={classes.form}>
            
            <Typography as="body1">
              Please enter your password to export the private key.
            </Typography>

            <FormControl className={classes.fieldPassword} error={error}>
              <TextField id="password" value={pass} onChange={e => setPass(e.target.value)}
                aria-describedby="password_helper" type="password" placeholder="Password"/>
              <FormHelperText>
                {helperText}
              </FormHelperText>
            </FormControl>

            <Button variant="contained" color="primary" type="submit" className={classes.formButton}>Submit</Button>
          </form>
        }

        {
          passValid && 
          <Box className={classes.flexBox}>
            <Alert severity="error" className={classes.important}>
              SAVE YOUR PRIVATE KEY
            </Alert>

            <div className={classes.copyGroup}>
              <textarea type="text" rows="3" readOnly value={privateKey}></textarea>
              <Clipboard component="button" button-href="#" data-clipboard-text={privateKey}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="icon"><path d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 0 1 2 2v4h4V2H8v4zM2 8v10h10V8H2z"/></svg>
              </Clipboard>
            </div>

            <div className={classes.keyInfo}>
              <p><strong>Do not lose it!</strong> It can't be recovered if you lose it.</p>
              <p><strong>Do not share it!</strong> Your funds will be stolen if you use it on a malicious site.</p>
              <p><strong>Make a backup!</strong> Just in case your laptop is set on fire.</p>
            </div>
            <Button variant="contained" color="primary" onClick={copyConfirmed}>I've copied it somewhere safe</Button>
          </Box>
        }

      </Container>
  </>)
}