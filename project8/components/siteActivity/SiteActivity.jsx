"use strict";

import React from 'react';
import { Link } from "react-router-dom";
import {
  Button,
  ListItem,
  Divider
}
from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import StarBorder from '@material-ui/icons/StarBorder';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';

import store from "../../redux";
import {setContextMessage} from '../../redux/actions';

var moment = require('moment');

const styles = {
  card: {
    maxWidth: '100%',
    margin: 10,
  },
  media: {
    height: 500,
  },
  textField: {
    display: 'block',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
  },
  button: {
    textAlign: 'center',
  },
};

function formatDateTime(datetime) {
  return moment(datetime).format('MM/DD/YYYY h:mm a');
}

class SiteActivity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activities: null,
      open: false,
      comment: "",
      photoDeleted: false
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };

    this.classes = this.props;
    this.errorMessage;
    this.fetchActivities();
    store.dispatch(setContextMessage("Activity Feed"));
  }

  fetchActivities() {
    console.log('/siteActivities');
    axios.get('/siteActivities')
    .then((response) => {
      console.log(response.data);
      this.setState({activities: response.data});
    })
    .catch((error) => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.setState({ open: true });
    });
  }



  listActivities() {
    var list = [];
    var activity, message, datetime;
    for (var i in this.state.activities) {
      activity = this.state.activities[i];
      datetime = new Date(activity.date_time);
      if (activity.activity === "UPLOAD") {
        message = activity.user.first_name + " uploaded a photo";
        list[i] = (
          <ListItem key={activity._id}>
          <Link to={"/photo/" + activity.photo_id}>
          <Avatar>
            <Avatar alt="Remy Sharp" src={"../../images/" + activity.file_name} />
          </Avatar>
          </Link>
          <ListItemText primary={message} secondary={formatDateTime(datetime)}/>
          </ListItem>
        );
      } else if (activity.activity === "COMMENT") {
        message = activity.user.first_name + " commented on a photo";
        list[i] = (
          <ListItem key={activity._id}>
          <Link to={"/photo/" + activity.photo_id}>
          <Avatar>
            <Avatar alt="Remy Sharp" src={"../../images/" + activity.file_name} />
          </Avatar>
          </Link>
          <ListItemText primary={message} secondary={formatDateTime(datetime)} />
          </ListItem>
        );
      } else if (activity.activity === "REGISTER") {
        message = activity.user.first_name + " joined the community";
        list[i] = (
          <ListItem key={activity._id}>
          <ListItemAvatar>
            <Avatar>
              <StarBorder />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={message} secondary={formatDateTime(datetime)} />
          </ListItem>
        );
      } else if (activity.activity === "LOGIN") {
        message = activity.user.first_name + " logged in";
        list[i] = (
          <ListItem key={activity._id}>
          <ListItemAvatar>
            <Avatar>
              <StarBorder />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={message} secondary={formatDateTime(datetime)} />
          </ListItem>
        );
      } else if (activity.activity === "LOGOUT") {
        message = activity.user.first_name + " logged out";
        list[i] = (
          <ListItem key={activity._id}>
          <ListItemAvatar>
            <Avatar>
              <StarBorder />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={message} secondary={formatDateTime(datetime)} />
          </ListItem>
        );
      }
    }
    return list;
  }

  render() {
    return (
      <div>
      {this.listActivities()}

      <Divider style={{margin: "1rem"}}/>
      <Button
        onClick={() => {this.fetchActivities()}}
        variant="outlined"
        style={{margin: "1rem"}}
        color="secondary"
        autoFocus>
        Refresh
      </Button>
      </div>
    );
  }
}

export default withStyles(styles)(SiteActivity);
