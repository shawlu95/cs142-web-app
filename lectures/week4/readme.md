### Week 4

#### AngularJS [PDF](ReactJS.pdf)
* How does reactApp.js interacts with DOM? (page 3, 5)

```
let viewTree = React.createElement(ReactAppView, null);
let where = document.getElementById('reactapp');
ReactDOM.render(viewTree, where);
```

* How does reactApp.js interfaces with View class? (page 6)

```
class ReactAppView extends React.Component { constructor(props) {
    super(props);
... }
render() { ... };
export default ReactAppView;
```

* What is `props`? (page 6)
* What is the required method for a View class? (page 6, 7)
* How does `render()` method generates HTML? (page 7)

```
render() {
    return React.createElement('div', null,
        React.createElement('label', null,'Name: '),
        React.createElement('input',
{ type: 'text', value: this.state.yourName, onChange: (event) => this.handleChange(event) }),
        React.createElement('h1',  null,
                'Hello ', this.state.yourName, '!')
); }

```

```JavaScript
render() {
    return (
        <div>
            <label>Name: </label>
            <input
            type="text"
            value={this.state.yourName}
            onChange={this.handleChange}
            />
            <h1>Hello {this.state.yourName}!</h1>
        </div>
);
}
```


* How to save state in a View, and how React reacts when state changes? (page 10, 11)

```
class ReactAppView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {yourName: ""};
    }
    handleChange = (event) => {
        this.setState({ yourName: event.target.value });
    }
}
```

* Is HTML case-sensitive? Is JavaScript case-sensitive? (page 12)
* What is `JSX`? [intro](http://buildwithreact.com/tutorial/jsx)
> JSX is a preprocessor step that adds XML syntax to JavaScript. You can definitely use React without JSX but JSX makes React a lot more elegant.

* Basic use case of JSX: conditional, iteration, styling (page 15, 16, 17)
* Conditional

```
<div>{this.state.useSpanish ? <b>Hola</b> : "Hello"}</div>
```

```
let greeting;
const en = "Hello";  const sp = <b>Hola</b>;
let {useSpanish} = this.prop;
if (useSpanish) {greeting = sp} else {greeting = en};
<div>{greeting}</div>
```

* iteration
```
let listItems = [];
for (let i = 0; i < data.length; i++) {
   listItems.push(<li key={data[i]}>Data Value {data[i]}</li>);
}
return <ul>{listItems}</ul>;
```

* Styling, use `className`:

```
render() {
    return (
        <span className="cs142-code-name">...</span>
    );
}
```
* Lifecycle of a View component (page 18, 19)
![alt-text](../assets/lifecycle.png)
* Stateless components: just a function, not a class (page 20)

#### Responsive Web Design [RWD.pdf](RWD.pdf)
* What is CSS breakpoints and what are they used for.

#### Single-Paged Application [SPA.pdf](SPA.pdf)
* Concept of deep linking.
* React Router: how to pass in parameters (page 9, 10)
* Difference between Route `component`, `render` and `children`.
