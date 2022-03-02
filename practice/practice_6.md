### Practice 6: Namescope & Property
What does the following code snippets print? Fill in the comment below. Do not run code. Use reasoning only.

#### Question 1
```JavaScript
function CrayonStore() {
  var color = 'red';
  console.log(this.color);
  return function () {
    console.log(this.color);
    console.log(color);
  };
}

f = new CrayonStore();
// print: 'undefined'
// print: _______

f();
// print: undefined
// red
```

**Note:**
CrayonStore() returns a function definition, not a function that gets executed. Therefore it will not process what's in the returned functiom.

f here is this returned function definition.

Therefore, f() executes the returned function.

As for the namescope, var color is a local variable (as a property it should be declared as this.color).


___
#### Question 2

```JavaScript
function CrayonStore() {
  this.color = 'red';
  console.log(this.color);

  return function () {
    console.log(this.color);
    console.log(color);
  };
}

f = new CrayonStore();
// print: red

f();
// print: undefined
// print: ReferenceError
```

**Note:**

___
#### Question 3

```JavaScript
var color = 'blue'; // <-
function CrayonStore() {
  var color = 'red';
  console.log(this.color);

  return function () {
    console.log(this.color);
    console.log(color)
  };
}

f = new CrayonStore();
// Can you declare a function both globally and locally??
// print: undefined

f();
// print: undefined
// print: red
```

**Note:**
In f() the "this" refers to the global object.

___
#### Question 4

```JavaScript
var color = 'blue';
function CrayonStore() {
  var color = 'red';
  console.log(this.color);

  return function () {
    var color = 'green'; // <-
    console.log(this.color);
    console.log(color)
  };
}

f = new CrayonStore();
// print: undefined

f();
// print: undefined
// print: green
```

**Note:**

___
#### Question 5
Write object type, without definition.

```JavaScript
function CrayonStore() {
  console.log(this);
  return function () {
    console.log(this);
  };
}

f = new CrayonStore();
// print: CrayonStore{}
//(if there are properties in CrayonStore, they will also get printed out in the {})

f();
// print: global object
```

**Note:**

___
#### Question 6

```JavaScript
function CrayonStore() {
  this.color = 'red';
  console.log(this.color);

  return function () {
    console.log(this.color);
  };
}

f = new CrayonStore();
// print: red

f();
// print: undefined
```

**Note:**
