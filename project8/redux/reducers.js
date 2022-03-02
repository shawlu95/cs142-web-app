import { combineReducers } from 'redux'

import {
  SET_LOG_IN_STATUS,
  CACHE_LOGGED_IN_USER,
  TOGGLE_ADVANCED_FEATURE,
  SET_CONTEXT_MESSAGE
} from './actions'

var placeholder = {
  first_name: "John",
  last_name: "Ousterhout",
  login_name: "john",
  _id: "5cee051807c9e00753fc63aa"
}

function loginStatus(state = null, action) {
  switch (action.type) {
    case SET_LOG_IN_STATUS:
      return action.login_name;
    default:
      return state;
  }
}

function loggedInUser(user = null, action) {
  switch (action.type) {
    case CACHE_LOGGED_IN_USER:
      return action.user;
    default:
      return user;
  }
}

function advancedFeature(state = false, action) {
  switch (action.type) {
    case TOGGLE_ADVANCED_FEATURE:
      return action.bool;
    default:
      return state;
  }
}

function contextMessage(message = "", action) {
  switch (action.type) {
    case SET_CONTEXT_MESSAGE:
      return action.message;
    default:
      return message;
  }
}

const PhotoSharingApp = combineReducers({
  loginStatus,
  loggedInUser,
  advancedFeature,
  contextMessage

})

export default PhotoSharingApp
