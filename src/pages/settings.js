import React from 'react';
import {  Container, List, ListItem, ListItemText, ListItemIcon, Card, CardContent, CardActions, Typography, Icon, ListItemSecondaryAction, Button } from '@material-ui/core'
import BackButtonHeader from '../components/back-button-header'
import { makeStyles } from '@material-ui/core/styles';

import Header from '../components/header'
import { useHistory } from 'react-router-dom'
import { allWallets, networkProvider } from '../store/atoms';
import { useRecoilState, useRecoilValue } from 'recoil';
import { compressAddress } from '../utils/format-utils'
import { Check, OpenInNew } from '@material-ui/icons';
import { encryptKeyStore } from '../utils/keystore';

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
  spacer: {
    flex: '1'
  },
  partners: {
    '& img': {
      maxWidth: theme.spacing(40)
    }
  },
  addressLI: {
    paddingLeft:0,
    paddingRight:0
  },
  addressLICheck: {
    minWidth: theme.spacing(4)
  }
}));

export default function Settings() {
  const classes = useStyles( );
  const history = useHistory();

  const [allWal, setAllWal] = useRecoilState(allWallets);
  const provider = useRecoilValue(networkProvider);

  const addAccount = () => {
    const account = provider.eth.accounts.create();
    let pass = '';
    for(let i = 0; i < allWal.length; i++) {
      let wal = allWal[i];
      if(wal.current) {
        pass = wal.password;
      }
    }

    const keystore = encryptKeyStore(provider, account.privateKey, pass);

    setAllWal((current) => {
      const all = [...current];
      all.push({
        address: account.address,
        password: pass,
        keystore: keystore,
        current: false
      })
      return all;
    });

  }

  const historyPush = (link) => {
    history.push(`/${link}`);
  }

  return (<>
    <Header loggedIn={true}>
      <BackButtonHeader title="Settings" />
    </Header>
    <Container className={classes.root}>
      <Card>
        <CardContent>
          <Typography variant="caption" >All Accounts</Typography>
          <List dense={false}>
            {allWal.map((wallet, index) => {
              return <ListItem key={index} className={classes.addressLI}>
                <ListItemIcon className={classes.addressLICheck}>
                  {wallet.current && <Check color="primary" />}  
                </ListItemIcon>
                <ListItemText primary={compressAddress(wallet.address, 16)}></ListItemText>
                <ListItemSecondaryAction>
                  <Icon edge="end">
                    <OpenInNew />
                  </Icon>
                </ListItemSecondaryAction>
              </ListItem>
            })}
          </List>
        </CardContent>
        <CardActions>
          <Button variant="contained" color="primary" onClick={addAccount}>Add Account</Button>
        </CardActions>
      </Card>
      <List >
        <ListItem button onClick={() => historyPush('export-key')}>
          <ListItemText primary="Export Key"></ListItemText>
        </ListItem>
        <ListItem button onClick={() => historyPush('about-us')}>
          <ListItemText primary="About Moomask" ></ListItemText>
        </ListItem>
      </List>
    </Container>
  </>)
}