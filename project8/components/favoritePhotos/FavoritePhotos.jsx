"use strict";

import React from 'react';
import Modal from 'react-modal';
import {
  Typography,
  Button,
  ListItem,
  Divider
}
from '@material-ui/core';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import axios from 'axios';

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from "@material-ui/core/IconButton";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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
  link: {
    textDecoration: 'none',
  },
  linkText: {
    marginLeft: 10,
    minWidth: '100px',
    marginDown: 0,
  },
};

const modalStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '50%',
    width: "60%",
    transform             : 'translate(-50%, -50%)'
  }
};
Modal.setAppElement('#photoshareapp')


function formatDateTime(datetime) {
  return moment(datetime).format('MM/DD/YYYY h:mm a');
}

class FavoritePhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorites: null,
      open: false,
      modalIsOpen: false,
      favorite: null
    };

    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

    this.handleClose = () => {
      this.setState({ open: false });
    };

    this.classes = this.props;
    this.errorMessage;
    this.fetchFavorites();
    store.dispatch(setContextMessage("Favorite Photos"));
  }

  openModal = (favorite) => (event) => {
    console.log(event);
    this.setState({modalIsOpen: true, favorite: favorite});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    // this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  fetchFavorites() {
    console.log('/photos/favorites');
    axios.get('/photos/favorites/' + store.getState().loggedInUser._id)
    .then((response) => {
      console.log(response.data);
      this.setState({favorites: response.data});
    })
    .catch((error) => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.setState({ open: true });
    });
  }

  removeFavoritePhoto = (photo_id) => event =>  {
    console.log(event);
    const user_id = store.getState().loggedInUser._id;
    console.log("/photos/unfavorite/" + user_id + "/" + photo_id);
    axios.post("/photos/unfavorite/" + user_id + "/" + photo_id)
    .then((response) => {
      console.log(response);
      // fetch photos again, server will mark each photo as favorited or not
      this.errorMessage = "Photo has been removed from favorites.";
      this.setState({open:true});
      this.fetchFavorites();
    })
    .catch((error) => {
      console.log(error);
      this.errorMessage = error.response.data.message;
      this.setState({open:true});
    });
  }

  buildPhotoList() {
    // const classes = useStyles();
    var photos = [];
    var favorite;
    for (var i in this.state.favorites) {
        favorite = this.state.favorites[i];
        console.log(favorite);
        photos[i] = (
          <ListItem key={favorite._id + i}>

          <IconButton onClick={this.openModal(favorite)}>
          <Avatar alt="Remy Sharp" src={"../../images/" + favorite.file_name} />
          </IconButton>

          <ListItemText
            primary={favorite.likes.length + " Likes, " + favorite.comments.length + " Comments"}
            secondary={"Posted on " + formatDateTime(favorite.date_time)} />
            <IconButton
              color="secondary"
              aria-label="Add to shopping cart"
              onClick={this.removeFavoritePhoto(favorite._id)}
            >
            <DeleteIcon />
            </IconButton>
            <Divider/>
          </ListItem>
        );
    }
    return photos;
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
  modalWindow() {
    const favorite = this.state.favorite;
    if (favorite === null) {
      return (<div></div>)
    }
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        contentLabel="Example Modal"
        style={modalStyles}
      >
        <Typography
          color="textSecondary"
          variant="h6"
          component="h2"
          style={{margin: "1rem"}}>
          {favorite.file_name}
        </Typography>

        <Typography
          color="textSecondary"
          variant="subtitle2"
          component="h2"
          style={{margin: "1rem"}}>
          {"Posted on " + formatDateTime(favorite.date_time)}
        </Typography>

        <img
          alt={favorite.file_name}
          style={{width: "100%", display: "block"}}
          src={"../../images/" + favorite.file_name}
        />

        <Button onClick={this.closeModal}
        variant="outlined"
        style={{margin: "1rem"}}
        color="secondary">
        Close
        </Button>
      </Modal>
    )
  }

  render() {
    return (
      <div>
      <Typography
        color="textSecondary"
        variant="h6"
        component="h2"
        style={{margin: "1rem"}}>
        My Favorite Photos
      </Typography>

      {this.buildPhotoList()}
      <Divider style={{margin: "1rem"}}/>
      {this.alertUser()}
      {this.modalWindow()}
      </div>
    );
  }
}

export default withStyles(styles)(FavoritePhotos);
