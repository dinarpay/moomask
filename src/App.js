import React from 'react';

import './App.css';
import Header from './components/header'
import CreateWallet from './pages/create-wallet'
import ImportWallet from './pages/import-wallet'
import Signin from './pages/signin'

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import ConnectionProvider from './providers/connection-context';

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(',')
  },
  palette: {
    primary: {
      main: '#184c82'
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ConnectionProvider>
        <Router>
          <Container>
            <Header />
            <Switch>
              
              <Route path="/create-wallet">
                <CreateWallet />
              </Route>
              <Route path="/import-wallet">
                <ImportWallet />
              </Route>
              <Route path="/signin">
                <Signin />
              </Route>
              <Route exact path="/">
                <Signin />
              </Route>
            </Switch>
          </Container>
        </Router>
      </ConnectionProvider>
    </ThemeProvider>
    
  );
}

export default App;
