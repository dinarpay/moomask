import React from 'react'
import Header from '../components/header'
import BackButtonHeader from '../components/back-button-header'
import {  Button, Container, TextField, FormControl, FormHelperText, Snackbar } from '@material-ui/core'
import MuiAlert from '@material-ui/lab/Alert';

import { makeStyles } from '@material-ui/core/styles';
import { useSetRecoilState } from 'recoil';
import { allTokens } from '../store/atoms';

const useStyles = makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    padding:theme.spacing(2),
    display:'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 104px)'
  },
  flexBox: {
    display: 'flex',
    flexDirection: 'column'
  },
  formWrap: {
    flex: 1,
  },
  form: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column'
  },
  formControl: {
    marginBottom: theme.spacing(2),
  },
  formButton: {
    marginBottom: theme.spacing(2)
  },
  fullWidth: {
    width: '100%'
  }
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AddCustomToken() {
  const classes = useStyles( );

  const [vals, setVals] = React.useState({title: '', code: '', decimals: 18, main: '', test: ''});
  const [helpers, setHelpers] = React.useState({title: '', code: '', decimals: '', main: '', test: ''});
  const [error, setError] = React.useState({title: false, code: false, decimals: false, main: false, test: false});

  const setAllTokens = useSetRecoilState(allTokens);

  const [openSuccess, setOpenSuccess] = React.useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const {main, test, title, code, decimals} = vals;
    if(!main && !test) {
      setHelpers(hs => {
        return {...hs, 
          main: 'Need atleast one contract address',
          test: 'Need atleast one contract address'
        }
      });

      setError(hs => {
        return {...hs, main: true, test: true}
      });
      return;
    }

    let tokenInfo = {title, code, decimals};
    tokenInfo.contract = {
      "1": main,
      "2": test
    };

    setAllTokens((tokens) => {
      return [...tokens, tokenInfo];
    });

    setOpenSuccess(true);

  }
  
  return (
    <>
      <Header loggedIn={true}>
        <BackButtonHeader title="Add Custom Token" />
      </Header>
      <Container className={classes.root}>
        <div className={classes.formWrap}>
          <form method="post" onSubmit={handleSubmit} className={classes.form} >
            
            <FormControl error={error.title} className={classes.formControl}>
              <TextField id="title" value={vals.title} onChange={e => setVals((vals) => { return {...vals, title:e.target.value}})}
                type="text" label="Token name"  required/>
              <FormHelperText>{helpers.title}</FormHelperText>
            </FormControl>

            <FormControl error={error.code} className={classes.formControl}>
              <TextField id="code" value={vals.code} onChange={e => setVals((vals) => { return {...vals, code:e.target.value}})}
              type="text" label="Code" required/>
              <FormHelperText>{helpers.code}</FormHelperText>
            </FormControl>
            
            <FormControl error={error.decimals} className={classes.formControl}>
              <TextField id="decimals" value={vals.decimals} onChange={e => setVals((vals) => { return {...vals, decimals:e.target.value}})}
              type="number" label="Decimals" required/>
              <FormHelperText>{helpers.decimals}</FormHelperText>
            </FormControl>

            <FormControl error={error.main} className={classes.formControl}>
              <TextField id="main" value={vals.main} onChange={e => setVals((vals) => { return {...vals, main:e.target.value}})}
              type="text" label="Contract Mainnet address"/>
              <FormHelperText>{helpers.main}</FormHelperText>
            </FormControl>

            <FormControl error={error.test} className={classes.formControl}>
              <TextField id="test" value={vals.test} onChange={e => setVals((vals) => { return {...vals, test:e.target.value}})}
              type="text" label="Contract Testnet address"/>
              <FormHelperText>{helpers.test}</FormHelperText>
            </FormControl>
            
            <Button variant="contained" color="primary" type="submit">Save</Button>
          </form>
        </div>

        <Snackbar open={openSuccess} autoHideDuration={6000} onClose={() => setOpenSuccess(false)}>
          <Alert onClose={() => setOpenSuccess(false)} severity="success">
            Token added successfully!
          </Alert>
        </Snackbar>
      </Container>
    </>
  )
}