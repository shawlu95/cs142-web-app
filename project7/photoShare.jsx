"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

import {
  HashRouter, Route, Switch, Redirect
} from 'react-router-dom';
import {
  Grid, Paper
} from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/UserDetail';
import UserList from './components/userList/UserList';
import UserPhotos from './components/userPhotos/UserPhotos';
import UserComments from './components/userComments/UserComments';
import PhotoView from './components/photoView/PhotoView';
import LoginRegister from './components/loginRegister/LoginRegister';

// import redux
import { Provider } from 'react-redux';
import { cacheLoggedInUser } from './redux/actions';

// ----------------------------------
// test to do app (uncomment this section to see how the tutorial works)

// import todoApp from './reduxTutorial/reducers'
// const store = createStore(todoApp)
//
// // test logic
// import {
//   addTodo,
//   toggleTodo,
//   setVisibilityFilter,
//   VisibilityFilters
// } from './redux/actions'
//
// // Log the initial state
// console.log(store.getState())
//
// // Every time the state changes, log it
// // Note that subscribe() returns a function for unregistering the listener
// const unsubscribe = store.subscribe(() => console.log(store.getState()))
//
// // Dispatch some actions
// store.dispatch(addTodo('Learn about actions'))
// store.dispatch(addTodo('Learn about reducers'))
// store.dispatch(addTodo('Learn about store'))
// store.dispatch(toggleTodo(0))
// store.dispatch(toggleTodo(1))
// store.dispatch(setVisibilityFilter(VisibilityFilters.SHOW_COMPLETED))
//
// // Stop listening to state updates
// unsubscribe()

// end test to do app
// ----------------------------------

import store from "./redux"

// test store has been created properly
// import { setLogInStatus } from './redux/actions';
// console.log(store.getState());
// const unsubscribe = store.subscribe(() => console.log(store.getState()));
// store.dispatch(setLogInStatus('xiaolu'));
// store.dispatch(setLogInStatus(null));
// unsubscribe();

// localStorage.clear();

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.getState();
    store.subscribe(() => {
      console.log("Will refresh page.");
      this.setState(store.getState());
    })
  }

  userIsLoggedIn() {
    const loggedInUser = store.getState().loggedInUser;
    console.log("loggedInUser", loggedInUser);
    return loggedInUser !== null;
  }

  loggedInCheck() {
    if (!this.userIsLoggedIn()) {
      return (<Redirect to="/login-register/login" />);
    }
    console.log("User has logged in. ");
  }

  loginRedirect() {
    console.log("need to log in");
    return (
      <Redirect path="/" to="/login-register/login" />
    );
  }

  listView() {
    if (this.userIsLoggedIn()) {
      return (
        <Paper  className="cs142-main-grid-item">
          <UserList />
        </Paper>
      );
    } else {
      return (
        <Paper  className="cs142-main-grid-item">
        </Paper>
      );
    }
  }

  mainView() {
    if (this.userIsLoggedIn()) {
      console.log("User is logged in. Display components.");
      return (
        <Paper className="cs142-main-grid-item">
          <Switch>
            <Route path="/users/:userId"
              render={ props => <UserDetail {...props} /> }
            />
            <Route path="/photos/:userId"
              render ={ props => <UserPhotos {...props} /> }
            />
            <Route path="/comments/:userId"
              render ={ props => <UserComments {...props} /> }
            />
            <Route path="/photo/:photoId"
              render ={ props => <PhotoView {...props}/> }
            />
            <Route path="/login-register/:status"
              render ={ props => <LoginRegister {...props} /> }
            />
            {this.loggedInCheck()}
          </Switch>
        </Paper>
      );
    } else {
      console.log("User is not logged in. Redirect to login page.");
      return (
        <Paper  className="cs142-main-grid-item">
        <Switch>
          <Route path="/login-register/:status"
            render ={ props => <LoginRegister {...props} /> }
          />
          <Redirect to="/login-register/login" />
        </Switch>
        </Paper>
      );
    }
  }

  render() {

    // if (localStorage.getItem('loggedInUser') === null && store.getState().loggedInUser) {
    //   console.log("Save user to localStorage", store.getState().loggedInUser);
    //   localStorage.setItem('loggedInUser', store.getState().loggedInUser);
    // } else
    if (localStorage.getItem('loggedInUser') &&  store.getState().loggedInUser === null){
      console.log("Read from localStorage. Save to redux.", localStorage.getItem('loggedInUser'));
      store.dispatch(cacheLoggedInUser(JSON.parse(localStorage.getItem('loggedInUser'))));
    }

    console.log("login status", this.userIsLoggedIn());
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
        <Route path="/"
          render={ props => <TopBar {...props} /> }
        />
        <Route path="/users/:userId"
          render={ props => <TopBar {...props} /> }
        />
        <Route path="/photos/:userId"
          render={ props => <TopBar {...props} /> }
        />
        <Route path="/comments/:userId"
          render={ props => <TopBar {...props} /> }
        />
        <Route path="/photo/:photoId"
          render={ props => <TopBar {...props} /> }
        />
        </Grid>
        <div className="cs142-main-topbar-buffer"/>
        <Grid item sm={3}>
          {this.listView()}
        </Grid>
        <Grid item sm={9}>
          {this.mainView()}
        </Grid>
      </Grid>
      </div>
    </HashRouter>
    );
  }
}

//  <Provider> to magically make the store available to all container components
// in the application without passing it explicitly. You only need to use it once
// when you render the root component:
ReactDOM.render(
  <Provider store={store}>
    <PhotoShare/>
  </Provider>,
  document.getElementById('photoshareapp'),
);
