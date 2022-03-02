import React from 'react';
import ReactDOM from 'react-dom';

import Header from './components/header/Header';
import Switch from './components/switch/Switch';

var view = (
<div>
	<Header />
	<Switch />
</div>
);

ReactDOM.render(view, document.getElementById('reactapp'));
