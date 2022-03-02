"use strict"
import React from 'react';
import { Link } from "react-router-dom";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Button
}
from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import axios from 'axios';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Fab from '@material-ui/core/Fab';

import {styles} from "./userListStyle"

import store from "../../redux"

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);

    store.subscribe(() => {
      console.log("Subcription from userList: advancedFeature", store.getState().advancedFeature);
      this.setState({advanced: store.getState().advancedFeature});
    });

    console.log("constructor", store.getState());
    this.state = {
      open: false,
      userList: null,
      advanced: false,
    };

    this.handleAlertOpen = () => {
      this.setState({ open: true });
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };
  }

  userIsLoggedIn() {
    const loggedInUser = store.getState().loggedInUser;
    console.log("loggedInUser", loggedInUser);
    return loggedInUser !== null;
  }

  componentDidMount() {
    this.getUserList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.advanced !== this.state.advanced){
      this.getUserList();
    }
  }

  getUserList() {
    console.log('/user/list/' + this.state.advanced);
    axios.get('/user/list/' + this.state.advanced)
    .then((response) => {
      //response.data is a string type; JSON.parse decodes it into an array of dictionary
      console.log(response.data);
      this.setState({userList: response.data});
    })
    .catch((error) => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.handleAlertOpen();
    });
  }

  commentBadge(user) {
    if (this.state.advanced === false) {
      return;
    }
    const { classes } = this.props;
    return (
      <Link to={"/comments/" + user._id} className={classes.linkBadge}>
      <Fab color="secondary" size="small" className={classes.commentBadge}>
      {user.commentCount}
      </Fab>
      </Link>
    );
  }

  photoBadge(user) {
    if (this.state.advanced === false) {
      return;
    }
    const { classes } = this.props;
    return (
      <Link to={"/photos/" + user._id} className={classes.linkBadge}>
      <Fab size="small" className={classes.photoBadge}>
      {user.photoCount}
      </Fab>
      </Link>
    );
  }

  avatarBatch(user) {
    if (this.state.advanced === false) {
      return (
        <Avatar>
          <Avatar alt="Remy Sharp" src={"../../images/" + user.last_name.toLowerCase() + "1.jpg"} />
        </Avatar>
      );
    }
    return;
  }

  buildUserList() {
    // const classes = useStyles();
    var allUsers = [];
    var user;
    const { classes } = this.props;
    for (var i in this.state.userList) {
        user = this.state.userList[i];
        allUsers[i] = (
          <ListItem key={user._id}>
          {this.avatarBatch(user)}
          <Link to={"/users/" + user._id} className={classes.link}>
            <ListItemText primary= {user.first_name + " " + user.last_name} className={classes.linkText}/>
            <Divider/>
          </Link>

          {this.photoBadge(user)}
          {this.commentBadge(user)}

          </ListItem>
        );
    }
    return allUsers;
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    console.log(event.target.checked);
  };

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
    );
  }

  advanceFeature() {
    const { classes } = this.props;
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
        label="Advanced Features"
        className={classes.advanceFeature}
      />
    )
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <List component="nav" className={classes.root}>
          {this.buildUserList()}
        </List>
        {this.alertUser()}
      </div>
    );
  }
}

export default withStyles(styles)(UserList);
