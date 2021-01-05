import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { ArrowBack } from '@material-ui/icons';

import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    minHeight: theme.spacing(6)
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    fontSize: '1rem'
  },
}));

export default function BackButtonHeader({title}) {
  const classes = useStyles();

  const history = useHistory();

  const handleBackClick = () => {
    if(history.length) {
      history.goBack();
    } else {
      history.push('/');
    }
  }

  return (
    <Toolbar className={classes.root}>
      <IconButton edge="start" onClick={handleBackClick} className={classes.menuButton} color="inherit" aria-label="menu">
        <ArrowBack />
      </IconButton>
      <Typography variant="h6" className={classes.title}>
        {title}
      </Typography>
    </Toolbar>
  )
}