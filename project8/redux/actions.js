export const SET_LOG_IN_STATUS = 'SET_LOG_IN_STATUS';
export const CACHE_LOGGED_IN_USER = 'CACHE_LOGGED_IN_USER';
export const TOGGLE_ADVANCED_FEATURE = 'TOGGLE_ADVANCED_FEATURE';
export const SET_CONTEXT_MESSAGE = 'SET_CONTEXT_MESSAGE';

export function toggleAdvancedFeature(bool) {
  return { type: TOGGLE_ADVANCED_FEATURE, bool }
}

export function setLogInStatus(login_name) {
  return { type: SET_LOG_IN_STATUS, login_name }
}

export function cacheLoggedInUser(user) {
  return { type: CACHE_LOGGED_IN_USER, user }
}

export function setContextMessage(message) {
  return { type: SET_CONTEXT_MESSAGE, message }
}
