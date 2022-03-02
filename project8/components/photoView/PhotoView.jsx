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
import { MentionsInput, Mention, defaultStyle, defaultMentionStyle } from 'react-mentions'
import { withStyles } from '@material-ui/core/styles';
import { Link } from "react-router-dom";
import axios from 'axios';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Favorite from '@material-ui/icons/Favorite';
import IconButton from "@material-ui/core/IconButton";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";

import store from "../../redux";
import {setContextMessage} from '../../redux/actions';

var moment = require('moment');

function formatDateTime(datetime) {
  return moment(datetime).format('MM/DD/YYYY h:mm a');
}

import { merge } from 'lodash';
const scrollableStyle = merge({}, defaultStyle, {
    input: {
      overflow: 'auto',
      height: 50,
    },
})

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
      comment: "",
      photoDeleted: false,
      data: []
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

    // this.handleCommentSubmitBound = this.handleCommentSubmit.bind(this);
    this.errorMessage;
    store.dispatch(setContextMessage("Photo"));
    this.getUserList();
  }

  getUserList() {
    console.log('/user/list/' + this.state.advanced);
    axios.get('/user/list/' + this.state.advanced)
    .then((response) => {
      //response.data is a string type; JSON.parse decodes it into an array of dictionary
      console.log(response.data);
      var data = [];
      for (var user of response.data) {
        // cannot mention oneself
        if (user._id !== store.getState().loggedInUser._id) {
          data.push({
            id: user._id,
            display: user.first_name + " " + user.last_name
          })
        }
      }
      console.log(data);
      this.setState({data: data});
    })
    .catch((error) => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.handleAlertOpen();
    });
  }

  handleCommentDelete(photo, comment) {
    console.log("/comments/:photo_id/:comment_id", photo._id, comment._id);
    axios.delete('/comments/' + photo._id + "/" + comment._id)
    .then(response => {
      // receive updated photo data, and refresh page
      console.log(response);
      this.fetchPhotos();
    })
    .catch(error => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.handleAlertOpen();
    });
  }

  handlePhotoDelete(photo) {
    console.log("/photo/:photo_id", photo);
    axios.delete('/photos/' + photo._id)
    .then(response => {
      // receive updated photo data, and refresh page
      console.log(response);
      this.errorMessage = response.data.message;
      this.handleAlertOpen();
    })
    .catch(error => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.handleAlertOpen();
    });
  }

  componentDidMount() {
    this.fetchPhotos();
  }

  fetchPhotos() {
    console.log('/photo/' + this.props.match.params.photoId);
    axios.get('/photo/' + this.props.match.params.photoId)
    .then((response) => {
      console.log();
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
              {comment.user.first_name + " commented at " + formatDateTime(comment.date_time)}
            </Typography>
            <Typography component="p">
              {comment.comment}
            </Typography>
          </CardContent>
          <CardActions>
            <Avatar>
              <Avatar alt="Remy Sharp" src={"../../images/" + comment.user.last_name.toLowerCase() + "1.jpg"} />
            </Avatar>
            <Button component={Link} to={"/users/" + comment.user._id} variant="outlined" color="secondary">
              {comment.user.first_name + " " + comment.user.last_name}
            </Button>
            {this.commentDeleteButton(classes, photo, comment)}
          </CardActions>
        </Card>
      )
    }
    return allComments;
  }

  commentDeleteButton(classes, photo, comment) {
    if (store.getState().loggedInUser._id === comment.user._id) {
      return (
        <Button
          onClick={(e) => {
            console.log(e);
            this.handleCommentDelete(photo, comment);
          }}
          color="default"
          variant="outlined"
          className={classes.button}
          autoFocus>
          Delete Comment
        </Button>
      );
    }
  }

  photoDeleteButton(classes) {
    if (store.getState().loggedInUser._id === this.state.photo.user_id) {
      return (
        <Button
          onClick={(e) => {
            console.log(e);
            this.handlePhotoDelete(this.state.photo);
          }}
          color="default"
          variant="outlined"
          className={classes.button}
          autoFocus>
          Delete Photo
        </Button>
      );
    }
  }

  likePhoto = photo_id => event => {
    const user_id = store.getState().loggedInUser._id;
    if (event.target.checked) {
      axios.post("/photos/like/" + user_id + "/" + photo_id)
      .then((response) => {
        console.log("Liked photo ", photo_id, response);
        this.fetchPhotos();
      })
      .catch((error) => {
        console.log(error);
        this.errorMessage = error.response.data.message;
        this.setState({open:true});
      });
    } else {
      axios.post("/photos/unlike/" + user_id + "/" + photo_id)
      .then((response) => {
        console.log("Unliked photo ", photo_id, response);
        this.fetchPhotos();
      })
      .catch((error) => {
        console.log(error);
        this.errorMessage = error.response.data.message;
        this.setState({open:true});
      });
    } // close else
  };

  favoritePhoto = (photo_id) => event => {
    const user_id = store.getState().loggedInUser._id;
    console.log("/photos/favorite/:user_id/:photo_id: ", user_id, photo_id, event);

    axios.post("/photos/favorite/" + user_id + "/" + photo_id)
    .then((response) => {
      console.log(response);
      // fetch photos again, server will mark each photo as favorited or not
      this.fetchPhotos();
    })
    .catch((error) => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.setState({open:true});
    });
  }

  userLikedPhoto(photo){
    for (var i in photo.likes) {
      if (photo.likes[i].user_id === store.getState().loggedInUser._id) {
        return true;
      }
    }
    return false;
  }

  renderFavoriteButton(photo) {
    console.log(photo);
    if (photo.favorited) {
      return (<IconButton
        disabled
        color="secondary"
        aria-label="Add to shopping cart"
        onClick={this.favoritePhoto(photo._id)}
      >
        <AddShoppingCartIcon />

        <Typography
          color="textSecondary"
          gutterBottom
          variant="subtitle2"
          component="h2"
          style={{marginLeft: "0.5rem"}}>
          {"Added to favorites"}
        </Typography>
      </IconButton>);
    }

    return (<IconButton
      color="secondary"
      aria-label="Add to shopping cart"
      onClick={this.favoritePhoto(photo._id)}
    >
      <AddShoppingCartIcon />
    </IconButton>);
  }

  parseMentions (input) {
    // const input = this.state.mentionedUsersScript;
    var user_ids = input.match(/\((.+?)\)/g) || [];
    var user_names = input.match(/\[(.+?)\]/g) || [];
    for (var i in user_names){
      user_names[i] = user_names[i].slice(1,-1);
      user_ids[i] = user_ids[i].slice(1,-1);
    }
    return {user_ids: user_ids, user_names: user_names};
  }

  handleCommentSubmit = (event) => {
    const comment = this.state.comment || "";
    console.log("Submit comment", comment, event);

    var formatted = comment;
    var reg = new RegExp('\\(\\w*\\)', 'g');
    formatted = formatted.replace(reg, "");

    const mentions = this.parseMentions(comment);

    for (var user_name of mentions.user_names) {
      reg = new RegExp('\\[' + user_name + '\\]');
      formatted = formatted.replace(reg, user_name);
    }

    console.log("Mentioned:", mentions.user_ids);
    console.log("Mentioned:", mentions.user_names);

    const payload = {
      comment: formatted,
      mentions: mentions.user_ids,
      owner_id: this.state.photo.user_id
    };

    console.log(comment, payload);

    axios.post('/comments/' + this.state.photo._id, payload)
    .then(response => {
      console.log(response);
      this.setState({comment: ""})
      this.fetchPhotos();
    })
    .catch(error => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.setState({open: true});
    });
  }

  renderCommentTextFieldWithMentions(photo) {
    const { classes } = this.props;
    return (
      <MentionsInput
        id={photo._id}
        value={this.state.comment}
        onChange = {this.handleChange}
        style={scrollableStyle}
        placeholder={"Mention people with @"}
        className={classes.textField}
      >
        <Mention
          trigger="@"
          data={this.state.data}
          style={defaultMentionStyle}
          appendSpaceOnAdd={true}
          className = {classes.mentions__mention}
        />
      </MentionsInput>
    );
  }

  buildPhotosSection() {
    const { classes } = this.props;
    var photo = this.state.photo;
    if (photo === null) {
      return <div></div>;
    }

    var likeContext;
    if (this.userLikedPhoto(photo) === true && photo.likes.length === 1) {
      likeContext = "You liked the photo";
    } else if (this.userLikedPhoto(photo) === true) {
      likeContext = "You and " + (photo.likes.length - 1) + " others liked the photo";
    } else {
      likeContext = (photo.likes.length || "0") + " liked the photo";
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
                Posted at {formatDateTime(photo.date_time)}
              </Typography>
              <FormControlLabel
                control={
                  <Checkbox
                    icon={<FavoriteBorder />}
                    checkedIcon={<Favorite />}
                    checked={this.userLikedPhoto(photo)}
                    onChange={this.likePhoto(photo._id)}
                    value="checkedH"
                  />}
                label={<Typography
                  color="textSecondary"
                  gutterBottom
                  variant="subtitle2"
                  component="h2">
                  {likeContext}
                </Typography>}
              />

              {this.renderFavoriteButton(photo)}

            </CardContent>

          </CardActionArea>

          {this.renderCommentTextFieldWithMentions(photo)}

          <CardActions>
            <Button
              onClick={this.handleCommentSubmit}
              color="primary"
              variant="outlined"
              className={classes.button}
              autoFocus>
              Submit Comment
            </Button>
            {this.photoDeleteButton(classes)}
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
