import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.css';

import Header from './components/header/Header';
import Example from './components/example/Example';

var view = (
<div>
	<Header />
	<Example />
</div>
);

ReactDOM.render(
  view,
  document.getElementById('reactapp'),
);
