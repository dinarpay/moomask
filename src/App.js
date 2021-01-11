import React from 'react';

import './App.css';
import CreateWallet from './pages/create-wallet'
import ImportWallet from './pages/import-wallet'
import Signin from './pages/signin'
import Home from './pages/home'
import AboutUs from './pages/about-us'
import Send from './pages/send'
import Receive from './pages/receive'
import TransactionDetail from './pages/transaction-details';
import WalletDetail from './pages/wallet-details';
import ExportKey from './pages/export-key';
import AddCustomToken from './pages/add-token';

import { useRecoilState } from 'recoil';
import { allTokens, currentWallet } from './store/atoms';

import {
  MemoryRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Settings from './pages/settings';
import ALL_TOKENS from './config/tokens';

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

  const [walletAtom] = useRecoilState(currentWallet);
  const [loggedIn, setLoggedIn] = React.useState(false);

  const [currentTokens, setCurrentTokens] = useRecoilState(allTokens);

  React.useEffect(() => {
    if(walletAtom && walletAtom.address && walletAtom.password && walletAtom.keystore) {
      setLoggedIn(true);
    }else {
      setLoggedIn(false);
    }
  }, [walletAtom]);


  React.useEffect(() => {
    if(currentTokens.length === 0) {
      setCurrentTokens(ALL_TOKENS);
    }
  }, [currentTokens]);

  return (
    <ThemeProvider theme={theme}>
        <Router>
            <Switch>
              <Route path="/create-wallet">
                <CreateWallet />
              </Route>
              <Route path="/import-wallet">
              { loggedIn ? <Home /> : <ImportWallet /> }
              </Route>
              <Route path="/signin">
                <Signin />
              </Route>
              <Route path="/about-us">
                <AboutUs />
              </Route>
              <Route path="/send">
                <Send />
              </Route>
              <Route path="/settings">
                <Settings />
              </Route>
              <Route path="/receive">
                <Receive />
              </Route>
              <Route path="/export-key">
                <ExportKey />
              </Route>
              <Route path="/add-token">
                <AddCustomToken />
              </Route>
              <Route path="/transaction/:hash" component={TransactionDetail}>
              </Route>
              <Route path="/wallet/:address/:index" component={WalletDetail}>
              </Route>
              <Route exact path="/">
                { loggedIn ? <Home /> : <Signin />}
              </Route>
            </Switch>
        </Router>
    </ThemeProvider>
  );
}

export default App;
