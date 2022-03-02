"use strict";
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, Typography, Button
} from '@material-ui/core';
import axios from 'axios';

import { Link } from "react-router-dom";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import store from "../../redux"
import styles from "./TopBarStyle"

import {
  cacheLoggedInUser,
  toggleAdvancedFeature,
  setContextMessage
} from '../../redux/actions';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    // TODO: fix this to read session state
    this.state = {
      open: false,
      deleteOpen: false,
      loggedInUser: store.getState().loggedInUser,
      v: null,
      advanced: store.getState().advancedFeature,
    };

    this.errorMessage;
    this.uploadInput;


    this.handleClose = () => {
      this.setState({ open: false });
    };

    this.handleDeleteClose = () => {
      this.setState({ deleteOpen: false });
    };

    this.handleLogoutBound = this.handleLogout.bind(this);
    this.handleDeleteBound = this.handleDelete.bind(this);
  }

  userIsLoggedIn() {
    const loggedInUser = store.getState().loggedInUser;
    return loggedInUser !== null;
  }

  componentDidMount() {
    // read version info
    axios.get("/test/info")
    .then((response) => {
      var data = response.data;
      this.setState({v: data.version});
    })
    .catch((error) => {
      this.errorMessage = error.response.data.message;
      this.setState({ open: true });
    });

    // read user detail
    if (store.getState().loggedInUser) {
      // this.fetchUserDetail();
      this.message = "Hello, " + store.getState().loggedInUser.first_name;
    } else {
      this.message = "Please Login";
    }
    store.dispatch(setContextMessage(this.message));
  }

  componentDidUpdate(prevProps, prevState) {
    // var path = this.props.match.path;
    if (store.getState().loggedInUser) {
      if (prevProps !== undefined && prevProps.location.pathname !== this.props.location.pathname) {
        // this.fetchUserDetail();
      }
    }
    if ((prevState.loggedInUser) && (prevState.loggedInUser._id !== this.props.match.params.userId)){
      // console.log(prevState.loggedInUser._id);
      // console.log(this.props.match.params.userId);
      // this.fetchUserDetail();
    }
  }

  // fetchUserDetail() {
  //   axios.get('/user/' + this.props.match.params.userId)
  //   .then((response) => {
  //     var data = response.data;
  //     var path = this.props.match.path;
  //     var full_name = data.first_name + " " + data.last_name;
  //     if (path === "/photos/:userId") {
  //       this.message = "Photos of " + full_name;
  //     } else if (path === "/users/:userId") {
  //       this.message = full_name;
  //     } else if (path === "/comments/:userId") {
  //       this.message = "Comments by " + full_name;
  //     }
  //     this.setState({loggedInUser: data});
  //     store.dispatch(setContextMessage(this.message));
  //   })
  //   .catch((error) => {
  //     this.errorMessage = error.response.data.message;
  //     this.setState({ open: true });
  //   });
  // }

  alertUser() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Note"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  confirmAccountDelete = () => {
    console.log("Confirmed account deletion.");
    this.setState({ deleteOpen: false });

    axios.delete('/user/' + store.getState().loggedInUser._id)
    .then(response => {
      // redirect to login page
      console.log(response);
      localStorage.clear();
      store.dispatch(cacheLoggedInUser(null));
    })
    .catch(error => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.setState({open: true});
    });
  }

  alertAccountDelete() {
    return (
      <Dialog
        open={this.state.deleteOpen}
        onClose={this.handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Warning!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting account will remove all of your photos, comments and likes.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.confirmAccountDelete} color="secondary" autoFocus>
            Delete
          </Button>
          <Button onClick={this.handleDeleteClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  handleChange = name => event => {
    console.log("toggle advance feature", name, event.target.checked );
    this.setState({ [name]: event.target.checked });
    store.dispatch(toggleAdvancedFeature(event.target.checked));
  };

  advanceFeature() {
    return (
      <FormControlLabel
          control={
            <Checkbox
              checked={this.state.advanced}
              onChange={this.handleChange('advanced')}
              color="default"
              value="Advanced"
            />
          }
          label="Advanced Features"
        />
    );
  }

  activitiesButton(classes) {
    // Link to /site-activity
    console.log(classes);
    return (
      <Button
        component={Link}
        to={"/site-activity"}
        variant="outlined"
        color="inherit"
        autoFocus>
        Activities
      </Button>
    );
  }

  favoritesButton(classes) {
    return (
      <Button
        color="inherit"
        component={Link}
        to={"/favorites"}
        variant="outlined"
        className={classes.button}
        autoFocus>
        Favorites
      </Button>
    );
  }

  logoutButton(classes) {
    return (
      <Button
        onClick={this.handleLogoutBound}
        color="inherit"
        variant="outlined"
        className={classes.button}
        autoFocus>
        Logout
      </Button>
    );
  }

  deleteButton(classes) {
    return (
      <Button
        onClick={this.handleDeleteBound}
        color="inherit"
        variant="outlined"
        className={classes.button}
        autoFocus>
        Delete
      </Button>
    );
  }

  handleUploadButtonClicked = (e) => {
    e.preventDefault();
    if (this.uploadInput.files.length > 0) {
      // Create a DOM form and add the file to it under the name uploadedphoto
      const domForm = new FormData();
      domForm.append('uploadedphoto', this.uploadInput.files[0]);
      console.log(domForm, this.uploadInput.files[0]);
      console.log('/photos/new');
      axios.post('/photos/new', domForm)
      .then((res) => {
        console.log(res);
        this.errorMessage = "Photo has been uploaded.";
        this.setState({ open: true });
      })
      .catch(err => console.log(`POST ERR: ${err}`));
    } else {
      this.errorMessage = "Please select an image before uploading."
      this.setState({ open: true });
    }
  }

  uploadPhoto(classes) {
    return (
      <div>
      <input type="file"
        accept="image/*"
        ref={(domFileRef) => {
          this.uploadInput = domFileRef;
        }} />
      <label htmlFor="upload-buton">
        <Button variant="outlined"
          componment="span"
          color="inherit"
          className={classes.button}
          onClick={this.handleUploadButtonClicked}
          >
          Add Photo
        </Button>
      </label>
      </div>
    );
  }

  handleDelete() {
    console.log("Warning: will delete account!")
    // show alert
    this.setState({ deleteOpen: true });
  }

  handleLogout() {
    console.log("logout", this);
    axios.post('/admin/logout', {
      // empty body
    })
    .then((response) => {
      console.log(response.data);
      localStorage.clear();
      store.dispatch(cacheLoggedInUser(null));
      store.dispatch(setContextMessage("Please Login"));
      // localStorage.setItem('loggedInUser', null);
    })
    .catch((error) => {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      }
      console.log(error.response);
      this.errorMessage = error.response.data.message;
      this.setState({ open: true });
    });
  }

  handleUpload(e) {
    console.log("handle upload", this.uploadImage.files);
    e.preventDefault();
    if (this.uploadImage.files.length > 0) {

    // Create a DOM form and add the file to it under the name uploadedphoto
    const domForm = new FormData();
    domForm.append('uploadedphoto', this.uploadImage.files[0]);
    console.log(domForm, this.uploadImage.files[0]);
    console.log('/photos/new');
    axios.post('/photos/new', domForm)
      .then((res) => {
        console.log(res);
      })
      .catch(err => console.log(`POST ERR: ${err}`));
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
      <AppBar color="secondary" position="absolute">
        <Toolbar>
          <Typography className={classes.greet} variant="h5" color="inherit">
              {store.getState().contextMessage}
          </Typography>
          <Typography className={classes.versionContext} variant="subtitle2" color="inherit">
              {"Version: " + this.state.v}
          </Typography>
          {this.userIsLoggedIn() && this.advanceFeature()}
          {this.userIsLoggedIn() && this.uploadPhoto(classes)}
          {this.userIsLoggedIn() && this.activitiesButton(classes)}
          {this.userIsLoggedIn() && this.favoritesButton(classes)}
          {this.userIsLoggedIn() && this.logoutButton(classes)}
          {this.userIsLoggedIn() && this.deleteButton(classes)}
        </Toolbar>
      </AppBar>
      {this.alertUser()}
      {this.alertAccountDelete()}
      </div>
    );
  }
}

export default withStyles(styles)(TopBar);
