import React from 'react'

import {  Container, Typography, Box } from '@material-ui/core'
import BackButtonHeader from '../components/back-button-header'

import { makeStyles } from '@material-ui/core/styles';

import Header from '../components/header'
import { useRecoilValue } from 'recoil';
import { currentWallet } from '../store/atoms';

import Clipboard from 'react-clipboard.js';

import QRCode from "react-qr-code";


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
  }

}));

export default function Receive() {
  const classes = useStyles( );

  const wallet = useRecoilValue(currentWallet);

  return (
    <>
      <Header loggedIn={true}>
        <BackButtonHeader title="Receive" />
      </Header>
      <Container className={classes.root}>

        <Typography align="center" className={classes.bottomSpace}>Send to following address</Typography>
        <div className={classes.copyGroup}>
          <textarea type="text" rows="3" readOnly value={wallet.address}></textarea>
          <Clipboard component="button" button-href="#" data-clipboard-text={wallet.address}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" className="icon"><path d="M6 6V2c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8c0-1.1.9-2 2-2h4zm2 0h4a2 2 0 0 1 2 2v4h4V2H8v4zM2 8v10h10V8H2z"/></svg>
          </Clipboard>
        </div>
        <Box align="center" m={3}>
          <QRCode value={wallet.address} size={320}/>
        </Box>
        
      </Container>
    </>
  )
}