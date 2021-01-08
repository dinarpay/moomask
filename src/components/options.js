import React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import Refresh from '@material-ui/icons/Refresh';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { refreshCalled } from '../store/atoms';

const useStyles = makeStyles((theme) => ({
  refreshBtn: {
    padding: theme.spacing(1)
  }
}));

const KEY_SEND = 1;
const KEY_RECEIVE = 2;
const KEY_EXPORT = 3;
const KEY_ABOUT_US = 4;
const KEY_LOGOUT = 5;

const options = [
  {id: KEY_SEND, name: 'Send'},
  {id: KEY_RECEIVE, name: 'Receive'},
  {id: KEY_EXPORT, name: 'Export Private Key'},
  {id: KEY_ABOUT_US, name: 'About MooMask'},
  {id: KEY_LOGOUT, name: 'Logout'}
];

const ITEM_HEIGHT = 48;

export default function Options({loggedIn}) {
  const history = useHistory();

  const classes = useStyles(useTheme());

  const [refresh, setRefresh] = useRecoilState(refreshCalled);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    const updR = refresh + 1;
    setRefresh(updR);
  }

  const handleMenuItemClick = (event, {id}) => {
    switch(id) {
      case KEY_SEND:
        break;
      case KEY_RECEIVE:
        break;
      case KEY_EXPORT:
        break;
      case KEY_ABOUT_US:
        history.push('/about-us')
        break;
      case KEY_LOGOUT:
        break;
      default:
    }
    setAnchorEl(null);
  }

  return (
    <>
      {
      loggedIn && <IconButton
        className={classes.refreshBtn}
        aria-label="refresh"
        aria-haspopup="false"
        onClick={handleRefresh}
        >
          <Refresh />
        </IconButton>
      }
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        className={classes.refreshBtn}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {options.map((option) => (
          <MenuItem key={option.id}  onClick={(event) => handleMenuItemClick(event, option)}>
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}