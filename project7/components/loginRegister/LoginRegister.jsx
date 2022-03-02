"use strict"
import React from 'react';
import { Link, Redirect } from "react-router-dom";
import {
  // Typography,
  // ListItem,
  // ListItemText,
  Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
// import Avatar from '@material-ui/core/Avatar';
// import ImageIcon from '@material-ui/icons/Image';
// import WorkIcon from '@material-ui/icons/Work';
// import DraftsIcon from '@material-ui/icons/Drafts';
import axios from 'axios';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import TextField from '@material-ui/core/TextField';
// import { connect } from 'react-redux'
import { cacheLoggedInUser } from '../../redux/actions';
import {styles} from "./LoginRegisterStyle"

import store from "../../redux"

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class LoginRegister extends React.Component {
  constructor(props) {
    super(props);
    store.subscribe(() => {
      console.log("Subscribing to change: ", store.getState());
      this.render();
    });
    console.log("constructor", store.getState());

    this.state = {
      open: false,
      username: "",
      password1: "",
      password2: "",
      fname: "",
      lname: "",
      location: "",
      desc: "",
      occupation: ""
    };

    this.handleAlertOpen = () => {
      // clear password if login fails
      this.setState({ open: true, password1: "", password2: "" });
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };

    this.bindEventHandlers();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevState, prevProps);
    if ((prevProps !== null) && (prevProps.match.path !== this.props.match.path)) {
      console.log("reload");
    }
  }

  handleLogin() {
    console.log("handleLogin", this.state.username, this.state.password1);
    axios.post('/admin/login', {
      login_name: this.state.username,
      password: this.state.password1
    })
    .then(response => {
      console.log("Login succeeded.");
      console.log(response);

      // cause subcribe() to run
      store.dispatch(cacheLoggedInUser(response.data));
      if (localStorage.getItem('loggedInUser') === null && store.getState().loggedInUser) {
        console.log("Save user to localStorage", store.getState().loggedInUser);
        localStorage.setItem('loggedInUser', JSON.stringify(store.getState().loggedInUser));
      }
    })
    .catch(error => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.handleAlertOpen();
    });
  }

  handleRegister() {
    console.log("handleRegister", this.state);

    if (this.state.username === "" || this.state.fname === "" || this.state.lname === ""
    || this.state.password1 === "" || this.state.password2 === "") {
      this.errorMessage = "Please enter all required fields."
      this.handleAlertOpen();
      return;
    }

    if (this.state.password1 !== this.state.password2) {
      this.errorMessage = "The two passwords you entered do not match."
      this.handleAlertOpen();
      return;
    }

    axios.post('/user', {
      login_name: this.state.username,
      password: this.state.password1,
      first_name: this.state.fname,
      last_name: this.state.lname,
      location: this.state.location,
      description: this.state.desc,
      occupation: this.state.occupation
    })
    .then(response => {
      console.log("Registration succeeded.");
      console.log(response);

      // cause subcribe() to run
      store.dispatch(cacheLoggedInUser(response.data));
      if (localStorage.getItem('loggedInUser') === null && store.getState().loggedInUser) {
        console.log("Save user to localStorage", store.getState().loggedInUser);
        localStorage.setItem('loggedInUser', JSON.stringify(store.getState().loggedInUser));
      }
    })
    .catch(error => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.handleAlertOpen();
    });
  }

  bindEventHandlers() {
    console.log("bindEventHandlers");

    this.handleUsernameChange = event => {
      console.log(event.target.value);
      this.setState({ username: event.target.value });
    };

    this.handlePassword1Change = event => {
      console.log(event.target.value);
      this.setState({ password1: event.target.value });
    };

    this.handlePassword2Change = event => {
      console.log(event.target.value);
      this.setState({ password2: event.target.value });
    };

    this.handleFnameChange = event => {
      console.log(event.target.value);
      this.setState({ fname: event.target.value });
    };

    this.handleLnameChange = event => {
      console.log(event.target.value);
      this.setState({ lname: event.target.value });
    };

    this.handleLocationChange = event => {
      console.log(event.target.value);
      this.setState({ location: event.target.value });
    };

    this.handleDescChange = event => {
      console.log(event.target.value);
      this.setState({ desc: event.target.value });
    };

    this.handleOccupationChange = event => {
      console.log(event.target.value);
      this.setState({ occupation: event.target.value });
    };

    this.handleLoginBound = this.handleLogin.bind(this);
    this.handleRegisterBound = this.handleRegister.bind(this);
  }

  alertUser() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  loginView(classes) {
    return (
      <div>
      {
        this.userIsLoggedIn() ?
          <Redirect to={"/users/" + store.getState().loggedInUser._id} replace />
        :
          <div className={classes.container}>
          <TextField
            id="login_name_field"
            label="Name"
            className={classes.textField}
            value={this.state.username}
            onChange={this.handleUsernameChange}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <TextField
            id="password_field_1"
            label="Password"
            type="password"
            className={classes.textField}
            value={this.state.password1}
            onChange={this.handlePassword1Change}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <Button
            onClick={this.handleLoginBound}
            color="secondary"
            variant="outlined"
            autoFocus
            className={classes.button}>
            Login
          </Button>
          <Button
            component={Link}
            to={"/login-register/register"}
            color="secondary"
            variant="outlined"
            autoFocus
            className={classes.button}>
            Register
          </Button>
          {this.alertUser()}
          </div>
      }

      </div>
    );
  }

  registerView(classes) {
    return (
      <div>
      {
        this.userIsLoggedIn() ?
          <Redirect to={"/users/" + store.getState().loggedInUser._id} replace />
        :
        <div>
        <div className={classes.inputDiv}>
          <TextField
            required
            id="outlined-name"
            label="Login Name"
            className={classes.textField}
            value={this.state.username}
            onChange={this.handleUsernameChange}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <TextField
            required
            id="outlined-name"
            label="Password"
            type="password"
            className={classes.textField}
            value={this.state.password1}
            onChange={this.handlePassword1Change}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <TextField
            required
            id="outlined-name"
            label="Repeat Password"
            type="password"
            className={classes.textField}
            value={this.state.password2}
            onChange={this.handlePassword2Change}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <TextField
            required
            id="outlined-name"
            label="First Name"
            className={classes.textField}
            value={this.state.fname}
            onChange={this.handleFnameChange}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <TextField
            required
            id="outlined-name"
            label="Last Name"
            className={classes.textField}
            value={this.state.lname}
            onChange={this.handleLnameChange}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <TextField
            id="outlined-name"
            label="Location"
            className={classes.textField}
            value={this.state.location}
            onChange={this.handleLocationChange}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <TextField
            id="outlined-name"
            label="Description"
            className={classes.textField}
            value={this.state.desc}
            onChange={this.handleDescChange}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <TextField
            id="outlined-name"
            label="Occupation"
            className={classes.textField}
            value={this.state.occupation}
            onChange={this.handleOccupationChange}
            margin="normal"
            variant="outlined"
            fullWidth
          />
        </div>
        <div>
          <Button
            component={Link}
            to={"/login-register/login"}
            color="secondary"
            variant="outlined"
            autoFocus
            className={classes.button}>
            Back to Login
          </Button>
          <Button
            onClick={this.handleRegisterBound}
            color="secondary"
            variant="outlined"
            autoFocus
            className={classes.button}>
            Register Me
          </Button>
        </div>
        {this.alertUser()}
        </div>
      }
      </div>
    );
  }

  userIsLoggedIn() {
    const loggedInUser = store.getState().loggedInUser;
    console.log("loggedInUser", loggedInUser);
    return loggedInUser !== null;
  }

  render() {
    console.log("Render LoginRegister component.", this.props.match.path, this.props.match.params);
    const { classes } = this.props;
    if (this.props.match.params.status === "login") {
      return (this.loginView(classes));
    } else if (this.props.match.params.status === "register")  {
      return (this.registerView(classes));
    }
  }
}

// LoginRegister = connect()(LoginRegister);
export default withStyles(styles)(LoginRegister);
