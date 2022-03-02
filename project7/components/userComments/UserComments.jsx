"use strict";
import React from 'react';
import {
  Typography,
  Card,
  CardActions,
  CardContent,
  Button
}
from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import axios from 'axios';
import Avatar from '@material-ui/core/Avatar';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {styles} from "./userCommentsStyle"

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: null,
      open: false,
      selectedUserId: null
    };

    this.handleAlertOpen = () => {
      this.setState({ open: true });
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };

    this.classes = this.props;
  }

  componentDidMount() {
    this.changePhotos();
  }

  componentDidUpdate(prevProps, prevState) {
    if ((prevState.selectedUserId!== null) && (prevState.selectedUserId !== this.props.match.params.userId)){
      this.changePhotos();
    }
  }

  changePhotos() {
    axios.get('/photosCommentedByUser/' + this.props.match.params.userId)
    .then((response) => {
      console.log(response.data);
      this.setState({photos: response.data, selectedUserId: this.props.match.params.userId});
    })
    .catch((error) => {
      console.log(error);
      this.handleAlertOpen();
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
          <Button onClick={this.handleClose} color="primary" autoFocus>
            Dismiss
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  buildCommentsForPhoto(photo) {
    const { classes } = this.props;
    var allComments = [];
    var comment;
    for (var j in photo.comments){
      comment = photo.comments[j];
      if (comment.user_id === this.props.match.params.userId) {
        allComments[j] = (
          <Card key={photo._id + comment._id} className={classes.card}>
            <CardContent>
              <Typography className={classes.title} color="textSecondary" gutterBottom>
                {comment.date_time}
              </Typography>
              <Typography component="p">
                <Link to={"/photo/" + photo._id} className={classes.commentLink}>
                  {comment.comment}
                </Link>
              </Typography>
            </CardContent>
            <CardActions>
              <Button component={Link} to={"/photo/" + photo._id} color="secondary">
                <Avatar>
                  <Avatar alt="Remy Sharp" src={"../../images/" + photo.file_name} />
                </Avatar>
              </Button>
            </CardActions>
          </Card>
        )
      }
    }
    return allComments;
  }

  buildPhotosSection() {
    var allPhotos = [];
    var photo;
    for (var i in this.state.photos) {
        photo = this.state.photos[i];
        allPhotos[i] = (
          <div key={photo._id}>
            {this.buildCommentsForPhoto(photo)}
          </div>
      );
    }
    return allPhotos;
  }

  render() {
    console.log("COMMENT");
    return (
      <div>
        {this.buildPhotosSection()}
        {this.alertUser()}
      </div>
    );
  }
}

export default withStyles(styles)(UserPhotos);
