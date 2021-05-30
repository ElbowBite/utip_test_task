import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import DescriptionIcon from '@material-ui/icons/Description';
import CommentIcon from '@material-ui/icons/Comment';

import Home from './views/Home';
import Documents from './views/Documents';
import Comment from './views/Comment';
import { StoreProvider } from './store/storeContext';
import { capitalize } from '@material-ui/core';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  })
);

function App() {
  const classes = useStyles();

  const icons = [<HomeIcon />, <DescriptionIcon />, <CommentIcon />];

  return (
    <div className={classes.root}>
      <CssBaseline />
      <StoreProvider>
        <Router>
          <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }} anchor="left">
            <List>
              {['home', 'documents', 'comment'].map((text, index) => (
                <ListItem button key={capitalize(text)} component={Link} to={`/${index === 0 ? '' : text}`}>
                  <ListItemIcon>{icons[index]}</ListItemIcon>
                  <ListItemText primary={capitalize(text)} />
                </ListItem>
              ))}
            </List>
          </Drawer>

          <main className={classes.content}>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <Route path="/documents">
                <Documents />
              </Route>
              <Route path="/comment">
                <Comment />
              </Route>
            </Switch>
          </main>
        </Router>
      </StoreProvider>
    </div>
  );
}

export default App;
