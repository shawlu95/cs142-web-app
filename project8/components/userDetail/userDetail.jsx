"use strict"
import React from 'react';
import { Link } from "react-router-dom";
import {
  Divider,
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

import store from "../../redux";
import {setContextMessage} from '../../redux/actions';
import {styles} from "./userDetailStyle";

var moment = require('moment');

function formatDateTime(datetime) {
  return moment(datetime).format('MM/DD/YYYY h:mm a');
}

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
      this.setState({selectedUser:response.data});
      this.userId = this.props.match.params.userId;
      if (this.userId === store.getState().loggedInUser._id) {
        store.dispatch(setContextMessage("My Profile"));
      } else {
        store.dispatch(setContextMessage(response.data.first_name + "'s Profile"));
      }
    })
    .catch((error) => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.handleAlertOpen();
    });
  }

  profileBullet(user, classes) {
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

  workBullet(user, classes) {
    console.log(classes);
    return (
      <ListItem>
      <Avatar>
        <WorkIcon />
      </Avatar>
      <ListItemText primary="Occupation" secondary={user.occupation} />
      </ListItem>
    )
  }

  descriptionBullet(user, classes) {
    console.log(classes);
    return (
      <ListItem>
      <Avatar>
        <DraftsIcon />
      </Avatar>
      <ListItemText primary="Description" secondary={user.description} />
      </ListItem>
    )
  }

  photoBullet(user, classes) {
    console.log(classes);
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

  mostRecentPhoto(user, classes) {
    console.log(user, classes);
    return (
      <ListItem>

      <Link to={"/photo/" + user.mostRecent._id}>
      <Avatar>
        <Avatar alt="Tingyu Zheng" src={"../../images/" + user.mostRecent.file_name} />
      </Avatar>
      </Link>

      <ListItemText primary="Photo" secondary={"Posted at " + formatDateTime(user.mostRecent.date_time)} />
      </ListItem>
    );
  }

  avatarBadge(photo) {
    return (
      <Link to={"/photo/" + photo._id}>
      <Avatar>
        <Avatar alt="Remy Sharp" src={"../../images/" + photo.file_name} />
      </Avatar>
      </Link>
    );
  }

  mentionedPhotos(user, classes) {
    console.log(classes);
    var allPhotos = [];
    var mention;
    var message;
    for (var i in user.mentions) {
        mention = user.mentions[i];
        message = "Received " + mention.commentCount;
        message += mention.commentCount === 1 ? " comment" : " comments";
        allPhotos[i] = (
          <ListItem key={mention._id}>
          {this.avatarBadge(mention)}
          <ListItemText
            primary={
              <span style={{"display": "inline"}}>
              <Typography style={{"display": "inline"}}>{"In "}
              </Typography>

              <Link to={"/users/" + mention.user_id} style={{"display": "inline"}}>
              <Typography style={{"display": "inline"}}>
              {mention.owner_name}
              </Typography>
              </Link>

              <Typography style={{"display": "inline"}}>
              {"'s Photo"}
              </Typography>
              </span>
            }
            secondary={message}/>
          <Divider/>
          </ListItem>
        );
    }
    return allPhotos;
  }

  mostCommentedPhotos(user, classes) {
    console.log(classes);
    var allPhotos = [];
    var photo;
    var message;
    for (var i in user.mostCommented) {
        photo = user.mostCommented[i];
        message = "Received " + photo.commentCount;
        message += photo.commentCount === 1 ? " comment" : " comments";
        allPhotos[i] = (
          <ListItem key={photo._id}>
          {this.avatarBadge(photo)}
          <ListItemText primary="Photo" secondary={message}/>
          <Divider/>
          </ListItem>
        );
    }
    return allPhotos;
  }

  mentionedPhotosSection(user, classes) {
    console.log(classes);
    var context;
    var count = user.mentions.length;
    if (count === 0) {
      context = "Never Mentioned";
    } else {
      context = "Mentioned in " + count + (count == 1? " Photo" : " Photos");
    }
    return (
      <Typography component="span" variant="subtitle1" style={{marginLeft: "1rem"}} color="textPrimary">
        {context}
      </Typography>
    );
  }

  render() {
    const { classes } = this.props;
    // return empty section if user is not found
    if (!this.state.selectedUser) {
      return (<div></div>);
    }

    var user = this.state.selectedUser;
    console.log(user);
    return (
      <div>
      <div>
        {this.profileBullet(user, classes)}
        {this.workBullet(user, classes)}
        {this.descriptionBullet(user, classes)}
        {this.photoBullet(user, classes)}
        {this.alertUser()}
      </div>
      <Divider style={{margin: "1rem"}}/>

      <div>
      <Typography component="span" variant="subtitle1" style={{marginLeft: "1rem"}} color="textPrimary">
        {"Most Recent"}
      </Typography>
      {user.mostRecent !== null && this.mostRecentPhoto(user, classes)}
      <Divider style={{margin: "1rem"}}/>

      <Typography component="span" variant="subtitle1" style={{marginLeft: "1rem"}} color="textPrimary">
        {"Most Commented"}
      </Typography>
      {this.mostCommentedPhotos(user, classes)}
      <Divider style={{margin: "1rem"}}/>

      {user.mentions !== null && this.mentionedPhotosSection(user, classes)}
      {user.mentions !== null && this.mentionedPhotos(user, classes)}
      </div>
      </div>
    );
  }
}

export default withStyles(styles)(UserDetail);
