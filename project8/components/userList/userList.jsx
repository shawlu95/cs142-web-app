"use strict"
import React from 'react';
import { Link } from "react-router-dom";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Typography
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

import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import MailIcon from '@material-ui/icons/Mail';
import ImageIcon from '@material-ui/icons/Image';

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
      <IconButton aria-label="4 pending messages">
        <Badge badgeContent={user.commentCount || 0} color="secondary">
          <MailIcon />
        </Badge>
      </IconButton>
      </Link>
    );
  }

  photoBadge(user) {
    if (this.state.advanced === false) {
      return;
    }
    const { classes } = this.props;
    return (
      <Link to={"/photos/" + user._id} className={classes.photoBadge}>
      <IconButton aria-label="4 pending messages">
        <Badge badgeContent={user.photoCount || 0} color="secondary">
          <ImageIcon />
        </Badge>
      </IconButton>
      </Link>
    );
  }

  avatarBadge(user) {
    return (
      <Avatar>
        <Avatar alt="Remy Sharp" src={"../../images/" + user.last_name.toLowerCase() + "1.jpg"} />
      </Avatar>
    );
  }

  buildCurrentUser() {
    const user = store.getState().loggedInUser;
    const { classes } = this.props;
    return (
      <ListItem key={user._id}>
      {this.avatarBadge(user)}
      <Link to={"/users/" + user._id} className={classes.link}>
        <ListItemText primary= {user.first_name + " " + user.last_name} className={classes.linkText}/>
        <Divider/>
      </Link>
      </ListItem>
    );
  }

  buildUserList() {
    // const classes = useStyles();
    var allUsers = [];
    var user;
    const { classes } = this.props;
    for (var i in this.state.userList) {
        user = this.state.userList[i];

        // do not add logged-in user
        if (user._id !== store.getState().loggedInUser._id) {
          allUsers[i] = (
            <ListItem key={user._id}>
            {this.avatarBadge(user)}
            <Link to={"/users/" + user._id} className={classes.link}>
              <ListItemText primary= {user.first_name + " " + user.last_name} className={classes.linkText}/>
              <Divider/>
            </Link>

            {this.photoBadge(user)}
            {this.commentBadge(user)}

            </ListItem>
          );
        }
    }
    return allUsers;
  }

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
          <Button onClick={this.handleClose} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography className={classes.title} color="textSecondary" style={{marginLeft: "1rem", marginTop: "1rem"}} gutterBottom>
          {"Hello world, I'm"}
        </Typography>
        {this.buildCurrentUser()}
        <Divider style={{margin: "1rem"}}/>
        <Typography className={classes.title} color="textSecondary" style={{marginLeft: "1rem"}} gutterBottom>
          {"My Friends"}
        </Typography>
        <List component="nav" className={classes.root}>
          {this.buildUserList()}
        </List>
        {this.alertUser()}
      </div>
    );
  }
}

export default withStyles(styles)(UserList);
