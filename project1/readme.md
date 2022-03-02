### Checklist
1. How is model-view-controller paradigm implemented?
2. Follow naming convention as the example file?
3. What is model, view and controller in this project?

Problem 1
* Read through entire page.

Problem 2: States
* Search string must be a continuous substring.
* During filtering, filtered result should remain sorted alphabetically.
* Helpful: `Controlled Component`, search for example.

Problem 3: Personalized Header

Problem 4: Dynamic Switching
* Helpful: conditional rendering.

### Intro to React (190429-cs142-ps-720.mp4)
* Component = objects
* State = instance variables, assigned in constructor method as a dictionary.
To update state variable, use ```this.setState({variable : value});``` to automatically trigger render.
* Props = parameters, never change

#### JSX
* Mixing JavaScript with HTML
* Use {} to enclose JavaScript variable in HTML 

```
class Calendar extends React.Component {
	constructor() {
		this.state = {
			currentMonth : "Feb"
		}
	}

	render() {
		return <div>
			<div>
			{this.state.currentMonth} 1
			</div>
		</div>
	}
}
```

loop
``` 
days = [];
for (int i = 0; i <= 28; i++) {
	days.push(
		<div>
		{this.state.currentMonth} i
		</div>
		);
}
```

``` 
class Day extends React.Component {
	render() {
		<div> this.prop.day
	}
}
days = [];
for (int i = 0; i <= 28; i++) {
	days.push(
		<Day day = i/>
		);
}
```