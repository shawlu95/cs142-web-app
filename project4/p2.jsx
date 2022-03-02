import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header/Header';
import States from './components/states/States';

var view = (
<div>
	<Header />
	<States />
</div>
);

ReactDOM.render(view, document.getElementById('reactapp'));
