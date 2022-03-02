import React from 'react';
import './States.css';

/**
 * Define States, a React componment of CS142 project #4 problem #2.  The model
 * data for this view (the state names) is available
 * at window.cs142models.statesModel().
 */
class States extends React.Component {
  constructor(props) {
    super(props);
    this.allStates = window.cs142models.statesModel();
    this.state = {
      inputLetters: '',
   };

    this.handleChange = this.handleChange.bind(this);

    console.log('window.cs142models.statesModel()', window.cs142models.statesModel());
  }

  chooseStates() {
    // console.log(this.state.allStates);
    // console.log(this.state.inputLetters);
    var chosenStates = [];
    for (var i in this.allStates) {
      if (this.allStates[i].toLowerCase().includes(this.state.inputLetters.toLowerCase())){
        chosenStates[i] = <li key={i}>{this.allStates[i]}</li>;
      }
    }
    var message;
    if (chosenStates.length === 0) {
      message = (<p>No state found!</p>);
    }
    else {
      message = (<ul>{chosenStates}</ul>);
    }

    return message;
  }

  handleChange(event) {
    this.setState({ inputLetters: event.target.value });
  }

  render() {
    var filteredList = this.chooseStates();
    return (
      <div>
        <div className="search">
          <label>
            Search States: 
            <input type="text" value={this.state.inputLetters} onChange={this.handleChange} />
            
          </label>
          <div>
            <p>Your input: {this.state.inputLetters}</p>
            {filteredList}
          </div>
        </div>
      </div>
    );
  }
}

export default States;
