"use strict";
import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux'
import { createStore } from 'redux'

import PhotoSharingApp from './reducers';
const store = createStore(PhotoSharingApp);

export default store;
