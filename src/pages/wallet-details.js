import React from 'react'
import Header from '../components/header'
import BackButtonHeader from '../components/back-button-header'
import {  Button, Container, TextField, FormControlLabel, Checkbox } from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles';
import { useRecoilState, useRecoilValue } from 'recoil';
import { allWallets, currentNetwork, walletWithAddress } from '../store/atoms';
import { OpenInNew } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

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

function InternalWalletDetail({address, index}) {

  const classes = useStyles( );
  const [,setAllWal] = useRecoilState(allWallets);
  const walletDetails = useRecoilValue(walletWithAddress({address}));
  const network = useRecoilValue(currentNetwork);

  const [lbl, setLbl] = React.useState(`Address ${index}`);
  const [current, setCurrent] = React.useState(false);

  const history = useHistory();

  React.useEffect(() => {
    if(walletDetails) {
      if(walletDetails.label) {
        setLbl(walletDetails.label)
      }
      if(walletDetails.current) {
        setCurrent(walletDetails.current)
      }
    }
  }, [walletDetails]);

  const handleSubmit = (event) => {
    event.preventDefault();

    let updatedWallet = {...walletDetails};
    let changed = false;
    if(walletDetails.current !== current) {
      updatedWallet.current = current;
      changed = true;
    }
    if(walletDetails.label !== lbl) {
      updatedWallet.label = lbl;
      changed = true;
    }

    if(changed) {
      setAllWal(wallets => {
        const all = [];
        for(let i = 0; i < wallets.length; i++) {
          if(wallets[i].address === address) {
            all.push(updatedWallet);
          } else {
            if(current) {
              all.push({...wallets[i], current: false});
            } else {
              all.push(wallets[i]);
            }
          }
        }
        return all;
      });
    }

    history.goBack();
  }

  return (
    <>
      <div className={classes.formWrap}>
        <form method="post" onSubmit={handleSubmit} className={classes.form} >
          
          <TextField id="label" value={lbl} onChange={e => setLbl(e.target.value)}
            aria-describedby="label_helper" type="text" label="Name" className={classes.formControl} />
          
          <TextField id="address" value={walletDetails.address} disabled className={classes.formControl} 
            aria-describedby="address_helper" type="text" label="Address"/>

          <FormControlLabel
            control={
              <Checkbox
                checked={current}
                onChange={e => setCurrent(e.target.checked)}
                color="primary"
              />
            }
            label="Set as default"
          />
          <Button variant="contained" color="primary" type="submit">Update</Button>
        </form>
      </div>

      <Button target="_blank" href={`${network.explore}/address/${walletDetails.address}`} variant="contained" color="default" className={classes.fullWidth}
          endIcon={<OpenInNew ></OpenInNew>}>Open address</Button>

    </>
  )
}

export default function WalletDetail({match}) {
  const classes = useStyles( );
  const {address,index} = match.params;
  
  return (
    <>
      <Header loggedIn={true}>
        <BackButtonHeader title="Wallet" />
      </Header>
      <Container className={classes.root}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <InternalWalletDetail address={address} index={index} />
        </React.Suspense>
      </Container>
    </>
  )
}