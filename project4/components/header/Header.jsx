import React from 'react';
import './Header.css';

class Header extends React.Component {
	render() {
		return (
			<div>
				<h1 className="header1">Tingyu: the wind has risen</h1>
				<img src="./assets/timg.jpeg" alt="windRise" className="windRise"/>
				<h2 className="header2">Le vent se lève! . . . il faut tenter de vivre!</h2>
				<p></p>
			</div>
		);
	}
}
export default Header;