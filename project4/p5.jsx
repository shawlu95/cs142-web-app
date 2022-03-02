import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Link } from "react-router-dom";

import Header from './components/header/Header';
import States from './components/states/States';
import Example from './components/example/Example';
import './styles/p5.css';

var router = (
<HashRouter>
	<Fragment>
		<ul className="ul">
		<li><Link to="/states"><button type="button" className="button">Switch to States!</button></Link></li>
		<li><Link to="/example"><button type="button" className="button">Switch to Example!</button></Link></li>
		</ul>
		<Header />
		<Route exact path="/" component={Example}/>
		<Route path="/states" component={States}/>
		<Route path="/example" component={Example}/>
	</Fragment>
</HashRouter>
);

ReactDOM.render(router, document.getElementById('reactapp'));
