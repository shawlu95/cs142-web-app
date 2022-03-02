"use strict"
import React from 'react';
import { Link } from "react-router-dom";
import {
  Typography,
  ListItem,
  ListItemText,
  Button
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import DraftsIcon from '@material-ui/icons/Drafts';

import axios from 'axios';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import store from "../../redux"
import {styles} from "./userDetailStyle"

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.userId = this.props.match.params.userId;
    this.state = {
      open: false,
      selectedUser: store.getState().loggedInUser
    };

    this.handleAlertOpen = () => {
      this.setState({ open: true });
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };
  }

  componentDidMount() {
    if (this.userId) {
      this.fetchUserDetail();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.selectedUser !== null) && (prevState.selectedUser._id !== this.props.match.params.userId)){
      console.log(prevState.selectedUser._id, this.props.match.params.userId);
      // console.log(prevState.selectedUser._id);
      // console.log(this.props.match.params.userId);
      this.fetchUserDetail();
    }
  }

  fetchUserDetail() {
    axios.get('/user/' + this.userId)
    .then((response) => {
      //response.data is a string type; JSON.parse decodes it into an array of dictionary
      console.log(response.data);
      this.setState({selectedUser:response.data});
      this.userId = this.props.match.params.userId;
    })
    .catch((error) => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.handleAlertOpen();
    });
  }

  profileBullet(user) {
    const { classes } = this.props;
    return (
      <ListItem>
      <Avatar>
        <Avatar alt="Tingyu Zheng" src={"../../images/" + user.last_name.toLowerCase() + "1.jpg"} />
      </Avatar>

      <ListItemText
      primary={user.first_name + " " + user.last_name}
      secondary={
        <React.Fragment>
          <Typography component="span" className={classes.inline} color="textPrimary">
            {user.location}
          </Typography>
        </React.Fragment>
      }
      />
      </ListItem>
    )
  }

  workBullet(user) {
    return (
      <ListItem>
      <Avatar>
        <WorkIcon />
      </Avatar>
      <ListItemText primary="Occupation" secondary={user.occupation} />
      </ListItem>
    )
  }

  descriptionBullet(user) {
    return (
      <ListItem>
      <Avatar>
        <DraftsIcon />
      </Avatar>
      <ListItemText primary="Description" secondary={user.description} />
      </ListItem>
    )
  }

  photoBullet(user) {
    const { classes } = this.props;
    return (
      <ListItem>
      <Avatar>
        <ImageIcon />
      </Avatar>
      <Button component={Link} to={"/photos/" + user._id} variant="outlined" color="secondary" className={classes.photoButton}>
      {"View Photos"}
      </Button>
      </ListItem>
    )
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
    );
  }

  render() {
    // return empty section if user is not found
    if (!this.state.selectedUser) {
      return (<div></div>);
    }

    var user = this.state.selectedUser;
    return (
      <div>
        {this.profileBullet(user)}
        {this.workBullet(user)}
        {this.descriptionBullet(user)}
        {this.photoBullet(user)}
        {this.alertUser()}
      </div>
    );
  }
}

export default withStyles(styles)(UserDetail);
