"use strict";
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {
  AppBar, Toolbar, Typography, Button
} from '@material-ui/core';
import axios from 'axios';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = () => ({
  root: {
    flexGrow: 1,
  },
  leftContext: {
    minWidth: '10%',
    width: '15%',
    // height: '100%',  // does not work
  },
  versionContext: {
    width: '10%',
    // height: '100%',  // does not work
    marginLeft: 10,
  },
  rightContext: {
    textAlign: 'right',
    // height: '100%', // does not work
    width: '75%',
  },
})

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      selectedUser: null,
      v: null,
      error: null,
      advanced: false,
    };
    this.userId = null;

    if (props.match.path === "/photo/:photoId") {
      this.message = "Photo";
    } else {
      this.message = "";
    }


    this.handleAlertOpen = () => {
      this.setState({ open: true });
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };
  }

  componentDidMount() {
    // read version info
    axios.get("/test/info")
    .then((response) => {
      var data = response.data;
      this.setState({v: data.version});
    })
    .catch((error) => {
      this.handleAlertOpen();
      this.setState({error: error});
    });

    // read user detail
    if (this.props.match.params.userId !== undefined) {
      this.userId = this.props.match.params.userId;
      this.fetchUserDetail()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.selectedUser!== null) && (prevState.selectedUser._id !== this.props.match.params.userId)){
      // console.log(prevState.selectedUser._id);
      // console.log(this.props.match.params.userId);
      this.fetchUserDetail();
    }
  }

  fetchUserDetail() {
    axios.get('/user/' + this.props.match.params.userId)

    .then((response) => {
      var data = response.data;
      var path = this.props.match.path;
      var full_name = data.first_name + " " + data.last_name;
      if (path === "/photos/:userId") {
        this.message = "Photos of " + full_name;
      } else if (path === "/users/:userId") {
        this.message = full_name;
      } else if (path === "/comments/:userId") {
        this.message = "Comments by " + full_name;
      }
      this.setState({selectedUser: data});
    })
    .catch((error) => {
      this.handleAlertOpen();
      this.setState({error: error});
    });
  }

  alertUser() {
    return (
      <Dialog
        open={this.state.open}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Cannot Fetch from API"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Refresh the page and try again.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="secondary" autoFocus>
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  // triggered AFTER render() completes
  // componentDidUpdate(prevProps, prevState) {
  //   console.log(this.state.selectedUser);
  // }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  advanceFeature() {
    return (
      <FormControlLabel
          control={
            <Checkbox
              checked={this.state.advanced}
              onChange={this.handleChange('advanced')}
              color="secondary"
              value="Advanced"
            />
          }
          label="Advanced"
        />
    )
  }

  render() {
    console.log("Use advanced feature: ", this.state.advanced);
    const { classes } = this.props;
    return (
      <div className={classes.root}>

      <AppBar color="secondary" position="absolute">
        <Toolbar>
          <Typography className={classes.leftContext} variant="h5" color="inherit">
              Tingyu Zheng
          </Typography>
          <Typography className={classes.versionContext} variant="subtitle2" color="inherit">
              {"Version: " + this.state.v}
          </Typography>

          <Typography className={classes.rightContext} variant="h5" color="inherit">
              {this.message}
          </Typography>
        </Toolbar>
      </AppBar>
      {this.alertUser()}
      </div>
    );
  }
}

export default withStyles(styles)(TopBar);
