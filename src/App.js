import React from 'react';

import './App.css';
import CreateWallet from './pages/create-wallet'
import ImportWallet from './pages/import-wallet'
import Signin from './pages/signin'
import Home from './pages/home'
import AboutUs from './pages/about-us'
import Send from './pages/send'
import Receive from './pages/receive'

import { useRecoilState } from 'recoil';
import { currentWallet } from './store/atoms';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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

  React.useEffect(() => {
    if(walletAtom && walletAtom.address && walletAtom.address != '') {
      console.log('go to home screen');
      setLoggedIn(true);
    }
  }, [walletAtom]);

  return (
    <ThemeProvider theme={theme}>
        <Router>
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
              <Route path="/about-us">
                <AboutUs />
              </Route>
              <Route path="/send">
                <React.Suspense fallback={<div>Loading...</div>}>
                  <Send />
                </React.Suspense>
              </Route>
              <Route path="/receive">
                <Receive />
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
