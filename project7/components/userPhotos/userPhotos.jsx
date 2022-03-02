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

import {styles} from "./userPhotosStyle"

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: null,
      open: false,
      selectedUserId: null,
      comments: {}
    };
    this.handleAlertOpen = () => {
      this.setState({ open: true });
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };

    this.classes = this.props;
    this.handleCommentSubmitBound = this.handleCommentSubmit.bind(this);
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
    axios.get('/photosOfUser/' + this.props.match.params.userId)
    .then((response) => {
      //response.data is a string type; JSON.parse decodes it into an array of dictionary
      this.setState({photos: response.data, selectedUserId: this.props.match.params.userId});
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

  handleCommentSubmit = (event) => {
    const _id =  event.currentTarget.id;
    const comment = this.state.comments[_id];
    console.log("Submit comment", comment, _id);

    axios.post('/commentsOfPhoto/' + _id, {
      comment: comment
    })
    .then(response => {
      console.log(response);
      this.changePhotos();
    })
    .catch(error => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.handleAlertOpen();
    });
  }

  handleChange = (event) => {
    console.log("Photo & comment", event.target.id, event.target.value);
    var comments = this.state.comments;
    comments[event.target.id] = event.target.value;
    this.setState({comments: comments});
  }

  buildPhotosSection() {
    const { classes } = this.props;
    var allPhotos = [];
    var photo;
    for (var i in this.state.photos) {
        photo = this.state.photos[i];
        allPhotos[i] = (
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
                id={photo._id}
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
                  id={photo._id}
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
    return allPhotos;
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
