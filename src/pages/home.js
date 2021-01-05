import React from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import { useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Header from '../components/header';
import Balance from '../components/balance';
import CardActions from '@material-ui/core/CardActions';

import Transactions from '../components/transactions';
import TokenList from '../components/token-list';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { selectedNetworkId } from '../store/atoms';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  freeToken: {
    marginBottom: theme.spacing(2),
    textAlign: 'center'
  }
}));

export default function Home() {
  const classes = useStyles( useTheme() );
  const [value, setValue] = React.useState(0);

  const history = useHistory();

  const network = useRecoilValue( selectedNetworkId );

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Header loggedIn={true} >
        <Tabs value={value} variant="fullWidth"  onChange={handleChange} aria-label="Main Navigation">
          <Tab label="Account" {...a11yProps(0)} />
          <Tab label="Tokens" {...a11yProps(1)} />
          <Tab label="Transactions" {...a11yProps(2)} />
        </Tabs>
      </Header>
      <TabPanel value={value} index={0}>
        <React.Suspense fallback={<div>Loading...</div>}>
          {network === 2 && <Alert severity="info" icon={false} className={classes.freeToken}>
            <strong>
            <a href="https://testnet.binance.org/faucet-smart" target="_blank" rel="noreferrer">Click here</a>
            </strong> to get some tokens</Alert>}
          <Balance >
            <CardActions>
              <Button size="small" onClick={() => history.push('/send')} >
                Send
              </Button>
              <Button size="small" onClick={() => history.push('/receive')}>
                Receive
              </Button>
            </CardActions>
          </Balance>
        </React.Suspense>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <TokenList />
        </React.Suspense>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Transactions />
        </React.Suspense>
      </TabPanel>
    </div>
  )
}