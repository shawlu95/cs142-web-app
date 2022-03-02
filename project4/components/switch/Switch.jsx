import React from 'react';
import Example from '../example/Example';
import States from '../states/States';
import './Switch.css';

class Switch extends React.Component {
	constructor(props) {
		super(props); // Must run the constructor of React.Component first

		// Components have a special property named "state" that holds state.
		// We can initialize it here.
		// We read the example model data into the state variable 'name'
		this.state = {
			page: 'States',
			buttonName: 'Example',
			loadPage: <States />,
		};
	}

	handleButtonClick(event) {
		console.log(event);
		if (this.state.page === 'States') {
			this.setState({ page: 'Example' });
			this.setState({ buttonName: 'States' });
			this.setState({ loadPage: <Example />});
		}
		else {
			this.setState({ page: 'States' });
			this.setState({ buttonName: 'Example' }); 
			this.setState({ loadPage: <States />});

		}
		
	}

	render() {
		return (
		<div className="switch">
			<button type="button" className="button" onClick={e => this.handleButtonClick(e)}>
			Switch to {this.state.buttonName}
			</button>
			{this.state.loadPage}
		</div>
		)

	}

}
export default Switch;