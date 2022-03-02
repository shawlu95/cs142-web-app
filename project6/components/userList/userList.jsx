"use strict"
import React from 'react';
import { Link } from "react-router-dom";
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Button
}
from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import './userList.css';
import axios from 'axios';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Fab from '@material-ui/core/Fab';
import green from '@material-ui/core/colors/green';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  margin: {
    marginLeft: 100, // not useful
  },
  fab: {
    position: 'relative',
    margin: theme.spacing.unit,
    maxWidth:10,
    maxHeight:10,
  },
  commentBadge: {
    align: "right",
    backgroundColor: "secondary",
    marginRight: "5px"
  },
  photoBadge: {
    backgroundColor: green[700],
    color: "white",
    marginRight: "5px"
  },
  advanceFeature: {
    marginLeft: "7px"
  },
  link: {
    textDecoration: 'none',
  },
  linkText: {
    marginLeft: 10,
    minWidth: '100px',
  },
  linkBadge: {
    textDecoration: 'none',
  }
});

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      userList: null,
      error: null,
      advanced: false,
    };

    this.handleAlertOpen = () => {
      this.setState({ open: true });
    };

    this.handleClose = () => {
      this.setState({ open: false });
    };
  }

  componentDidMount() {
    this.changeUserList();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.advanced !== this.state.advanced){
      this.changeUserList();
    }
  }

  changeUserList() {
    console.log('/user/list/' + this.state.advanced);
    axios.get('/user/list/' + this.state.advanced)
    .then((response) => {
      //response.data is a string type; JSON.parse decodes it into an array of dictionary
      console.log(response.data);
      this.setState({userList: response.data});
    })
    .catch((error) => {
      this.handleAlertOpen();
      this.setState({error: error});
    });
  }

  commentBadge(user) {
    if (this.state.advanced === false) {
      return;
    }
    const { classes } = this.props;
    return (
      <Link to={"/comments/" + user._id} className={classes.linkBadge}>
      <Fab color="secondary" size="small" className={classes.commentBadge}>
      {user.commentCount}
      </Fab>
      </Link>
    );
  }

  photoBadge(user) {
    if (this.state.advanced === false) {
      return;
    }
    const { classes } = this.props;
    return (
      <Link to={"/photos/" + user._id} className={classes.linkBadge}>
      <Fab size="small" className={classes.photoBadge}>
      {user.photoCount}
      </Fab>
      </Link>
    );
  }

  avatarBatch(user) {
    if (this.state.advanced === false) {
      return (
        <Avatar>
          <Avatar alt="Remy Sharp" src={"../../images/" + user.last_name.toLowerCase() + "1.jpg"} />
        </Avatar>
      );
    }
    return;
  }

  buildUserList() {
    // const classes = useStyles();
    var allUsers = [];
    var user;
    const { classes } = this.props;
    for (var i in this.state.userList) {
        user = this.state.userList[i];
        allUsers[i] = (
          <ListItem key={user._id}>
          {this.avatarBatch(user)}
          <Link to={"/users/" + user._id} className={classes.link}>
            <ListItemText primary= {user.first_name + " " + user.last_name} className={classes.linkText}/>
            <Divider/>
          </Link>

          {this.photoBadge(user)}
          {this.commentBadge(user)}

          </ListItem>
        );
    }
    return allUsers;
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
    console.log(event.target.checked);
  };

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
    );
  }

  advanceFeature() {
    const { classes } = this.props;
    return (
      <FormControlLabel
          control={
            <Checkbox
              checked={this.state.advanced}
              onChange={this.handleChange('advanced')}
              color="secondary"
              value="Advanced"
            />
          }
          label="Advance Features"
          className={classes.advanceFeature}
        />
    )
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.advanceFeature()}
        <List component="nav" className={classes.root}>
          {this.buildUserList()}
        </List>
        {this.alertUser()}
      </div>
    );
  }
}

export default withStyles(styles)(UserList);
