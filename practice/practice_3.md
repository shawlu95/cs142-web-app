### Practice 3: *This* & Arrow

#### Question 1
Copy the following code to LeetCode playground. Add an event listener to the button. When user click the button, print "Hello" in `console.log` (you can expand console by clicking `Console` at the bottom of the page).

```JavaScript
import React from "react";
import ReactDOM from 'react-dom';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  printHello() {
  console.log("Hello!");
}

  render(){
    return (
      <div className="App">
        <button onClick={this.printHello}>Hello World</button>
      </div>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
```

Note: when you define a function inside a class, you have to call it with "this.". But if it is defined outside the class, you can call it as a normal function.

___
#### Question 2
Repeat the same exercise. This time use an arrow function. You should declare a function, and have the arrow function call the function.
```JavaScript
class App extends React.Component {
  constructor(props) {
    super(props);
  }
  printHello() {
  console.log("Hello!");
}

  render(){
    return (
      <div className="App">
        <button onClick={()=>{this.printHello();}}>Hello World</button>
      </div>
    );
  }
}
```
Note: here you can pretty much understand arrow function as a nameless function in whose scope you call another function, that is, the printHello function. Therefore, here you have to use `()=>{this.printHello();` instead of `()=>{this.printHello;`.
___
#### Question 3
Repeat the same exercise. This time do not declare a new function, have the arrow function print to `console.log` directly.
```JavaScript
class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div className="App">
        <button onClick={()=>{console.log("Hi");}}>Hello World</button>
      </div>
    );
  }
}
```
Note: you can have contents of a function directly inside the arrow function.

___
#### Question 4
The following implementation does not bind `this` or use arrow function. Does it work? Why?

**Ans:**
It sure works. Inside the hello() function there is no call to this, therefore the scope of this will not be confusing in this case.

```JavaScript
class App extends React.Component {
  hello() {
    console.log("hello");
  }

  render(){
    return (
      <div className="App">
        <button onClick={this.hello}>Hello World</button>
      </div>
    );
  }
}
```

___
#### Question 5
The following implementation does not bind `this` or use arrow function. Does it work? Why? What's the difference between this implementation and the one from above?

**Ans:**
This will not work as expected. `this.hello()` will run before you even click the button because it is executed directly, while `this.hello` is only a reference to (or in other words the definition of) a function and will not be executed right away.

```JavaScript
class App extends React.Component {
  hello() {
    console.log("hello");
  }

  render(){
    return (
      <div className="App">
        <button onClick={this.hello()}>Hello World</button>
      </div>
    );
  }
}
```

___
#### Question 6
Fix the following code to have it print:
```
hello 🌹
bye
```

Explain what you fixed and why:

**Ans:**
You will need an arrow function here, so the "this" will refer to the App class.
``<button onClick={()=>{
            console.log("hello", this.name);
            this.bye;
        }
      }>Hello World</button>``
```JavaScript
class App extends React.Component {
  constructor(props) {
      super(props);
      this.name = '🌹';
      this.bye = "bye";
  }

  bye() {
    console.log("bye");
  }

  render(){
    return (
      <div className="App">
        <button onClick={function () {
                    console.log("hello", this.name);
                    this.bye;
                }
              }>Hello World</button>
      </div>
    );
  }
}
```

___
#### Question 7
What does the console print when clicking the button? Explain why.

**Ans:**
Curiously, it prints out
`function bye() {
      console.log("Bye");
      return this.bye2();
    }`
Note: here this.bye is a function definition rather than a function executed.b

```JavaScript
class App extends React.Component {
  constructor(props) {
      super(props);
      this.bye2 = this.bye;
  }

  bye() {
    console.log("bye");
    return this.bye2();
  }

  render(){
    return (
      <div className="App">
        <button onClick={ () => {
                    console.log(this.bye);
                }
              }>Hello World</button>
      </div>
    );
  }
}
```

___
#### Question 8
What does the console print when clicking the button? Explain why does it behave differently from question 7.

**Ans:**
The program will crash.
It cannot print anything because before printing it will fall into an infinite loop between bye2 and bye.

```JavaScript
class App extends React.Component {
  constructor(props) {
      super(props);
      this.bye2 = this.bye;
  }

  bye() {
    console.log("bye");
    return this.bye2();
  }

  render(){
    return (
      <div className="App">
        <button onClick={ () => {
                    console.log(this.bye());
                }
              }>Hello World</button>
      </div>
    );
  }
}
```

___
#### Question 9
What does the console print when clicking the button? Explain why does it behave differently from question 8.

**Ans:**
It will first print a "bye" and then the whole definition of bye(). This is because bye returns bye2 rather than bye2(), and will not execute.

```JavaScript
class App extends React.Component {
  constructor(props) {
      super(props);
      this.bye2 = this.bye;
  }

  bye() {
    console.log("bye");
    return this.bye2;
  }

  render(){
    return (
      <div className="App">
        <button onClick={ () => {
                    console.log(this.bye());
                }
              }>Hello World</button>
      </div>
    );
  }
}
```
