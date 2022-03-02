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
import fetchModel from '../../lib/fetchModelData';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
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
      error: null
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

  changeUserList() {
    fetchModel('/user/list').then((response) => {
      //response.data is a string type; JSON.parse decodes it into an array of dictionary
      this.setState({userList: JSON.parse(response.data)});
    }, (error) => {
      this.handleAlertOpen();
      this.setState({error: error});
    });
  }

  buildUserList() {
    var allUsers = [];
    var user;
    for (var i in this.state.userList) {
        user = this.state.userList[i];
        allUsers[i] = (
          <ListItem key={user._id}>
          <Avatar>
            <Avatar alt="Remy Sharp" src={"../../images/" + user.last_name.toLowerCase() + "1.jpg"} />
          </Avatar>
          <Link to={"/users/" + user._id} style={{ textDecoration: 'none', marginLeft: 10 }}>
            <ListItemText primary= {user.first_name + " " + user.last_name}/>
            <Divider/>
          </Link>
          </ListItem>
        );
    }
    return allUsers;
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

  render() {
    return (
      <div>
        <List component="nav" className={this.props.root}>
          {this.buildUserList()}
        </List>
        {this.alertUser()}
      </div>
    );
  }
}

export default withStyles(styles)(UserList);
