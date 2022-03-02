import React from 'react';
import './userPhotos.css';
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

const styles = {
  card: {
    maxWidth: '100%',
    margin: 10,
  },
  media: {
    height: 500,
  },
};

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: null,
      open: false,
      error: null,
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
    axios.get('/photosOfUser/' + this.props.match.params.userId)
    .then((response) => {
      //response.data is a string type; JSON.parse decodes it into an array of dictionary
      this.setState({photos: response.data, selectedUserId: this.props.match.params.userId});
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
