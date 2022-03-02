"use strict";

import React from 'react';
import {
  Typography,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button
}
from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import axios from 'axios';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import TextField from '@material-ui/core/TextField';

// import {styles} from "./PhotoView"
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

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photo: null,
      open: false,
      comment: ""
    };
    this.handleAlertOpen = () => {
      this.setState({ open: true });
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };

    this.classes = this.props;

    this.handleChange = event => {
      console.log("comment input: ", event.target.value);
      this.setState({ comment: event.target.value });
    };

    this.handleCommentSubmitBound = this.handleCommentSubmit.bind(this);
    this.errorMessage;
  }

  handleCommentSubmit() {
    console.log("/commentsOfPhoto/:photo_id", this.state.comment, this.props.match.params.photoId);
    axios.post('/commentsOfPhoto/' + this.props.match.params.photoId, {
      comment: this.state.comment
    })
    .then(response => {
      console.log(response);
      this.setState({photo: response.data});
    })
    .catch(error => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.handleAlertOpen();
    });
  }

  componentDidMount() {
    this.changePhotos();
  }

  changePhotos() {
    console.log('/photo/' + this.props.match.params.photoId);
    axios.get('/photo/' + this.props.match.params.photoId)
    .then((response) => {
      this.setState({photo: response.data});
    })
    .catch((error) => {
      console.log(error);
      this.errorMessage = error.response.data.message;
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

  buildCommentsForPhoto(photo) {
    const { classes } = this.props;
    var allComments = [];
    var comment;
    for (var j in photo.comments){
      comment = photo.comments[j];
      allComments[j] = (
        <Card key={comment._id} className={classes.card}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              {comment.date_time}
            </Typography>
            <Typography component="p">
              {comment.comment}
            </Typography>
          </CardContent>
          <CardActions>
            <Button component={Link} to={"/users/" + comment.user._id} variant="outlined" color="secondary">
              {comment.user.first_name + " " + comment.user.last_name}
            </Button>
          </CardActions>
        </Card>
      )
    }
    return allComments;
  }

  buildPhotosSection() {
    const { classes } = this.props;
    var photo = this.state.photo;
    if (photo === null) {
      return <div></div>;
    }
    return (
      <div key={photo._id}>
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={"../../images/" + photo.file_name}
            />
            <CardContent>
              <Typography color="textSecondary" gutterBottom variant="subtitle2" component="h2">
                Posted on: {photo.date_time}
              </Typography>
            </CardContent>

          </CardActionArea>
          <TextField
            id="outlined-multiline-flexible"
            label="Comment"
            multiline
            rowsMax="4"
            value={this.state.comment}
            onChange={this.handleChange}
            margin="normal"
            variant="outlined"
            className={classes.textField}
            fullWidth
          />
          <CardActions>
            <Button
              onClick={this.handleCommentSubmitBound}
              color="primary"
              variant="outlined"
              className={classes.button}
              autoFocus>
              Submit Comment
            </Button>
          </CardActions>
        </Card>
        {this.buildCommentsForPhoto(photo)}
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.buildPhotosSection()}
        {this.alertUser()}
      </div>
    );
  }
}

export default withStyles(styles)(UserPhotos);
