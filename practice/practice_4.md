### Practice 4: Namespace & Closure

#### Question 1

Without running the code, what do you expect the following code to print?
x y
**Ans:**

```JavaScript
function main() {
    var x = "x";
    var y = "y";

    function nice(x, y) {
      console.log(y, x);
    }

    nice(y, x);
}

main();
```

Run the code in LeetCode playground. What does it print?

**Ans:**
same


What is the value of `x`, `y` in `main`'s stack space?

**Ans:**
```
x == ?;
y == ?;
```
"x" "y"

What is the value of `x`, `y` in `nice`'s stack space?

**Ans:**
```
x == ?;
y == ?;
```
"x" "y"

___
#### Question 2
Without running the code, what do you expect the following code to print?

**Ans:**
y x

```JavaScript
function main() {
    var x = "x";
    var y = "y";

    function nice() {
      console.log(y, x);
    }

    nice();
}

main();
```

Run the code in LeetCode playground. What does it print? Why?

**Ans:**
same

Since no parameter is passed into nice(), it goes up to the stack outside nice(), that is, the main function to look for the value of x and y.

___
#### Question 3
Without running the code, what do you expect the following code to print?

**Ans:**
error

```JavaScript
function main() {
    var x = "x";
    var y = "y";

    function nice(x, y) {
      console.log(y, x);
    }

    nice();
}

main();
```

Run the code in LeetCode playground. What does it print? Why?

**Ans:**
undefined undefined
No parameter is passed into the function.
Therefore the x and y in nice() is undefined.
But this will not cause an error.


___
#### Question 4
Without running the code, what do you expect the following code to print?

**Ans:**
null, null

```JavaScript
function main() {
    var x = "x";
    var y = "y";

    function nice(x=null, y=null) {
      console.log(y, x);
    }

    nice();
}

main();
```

Run the code in LeetCode playground. What does it print? Why?
**Ans:**
same
In the function definition, the two parameters are already defined to be null.
___
#### Question 5
Without running the code, what do you expect the following code to print?

**Ans:**
y x

```JavaScript
function main() {
    var x = "x";
    var y = "y";

    function nice(x=x, y=y) {
      console.log(y, x);
    }

    nice();
}

main();
```

Run the code in LeetCode playground. What does it print? Why?

**Ans:**
ReferenceError: x is not defined
In question3, nice function are defined with two parameters x and y but x and y are not assigned to anything, and therefore x and y will be undefined but will not cause an error.
In question4, the two parameters are assigned to nulls. This is pretty much the same as passing (x=2, y=6) as parameters, just that the values are null. therefore it will print two nulls.
In question5, x and y are assigned to x and y. Since the name x and y are already taken in this namespace, the x and y that should get assigned to will find x and y in this namespace. They will not go to the stack outside the nice function to look for values. But the x and y have no value and have never been declared, therefore it will cause an error.

___
#### Question 6
Without running the code, what do you expect the following code to print?

**Ans:**
ReferenceError: x is not defined

```JavaScript
function main() {
    var x = "x";
    var y = "y";

    function nice(x2=x, y2=y) {
      console.log(y2, x2);
    }

    nice();
}

main();
```

Run the code in LeetCode playground. What does it print? Why?

**Ans:**
y x

Why does it behave differently from question 5?

**Ans:**
The x and y that x2 and y2 are assigned to will go up to the main function stack to look for values of x and y.

___
#### Question 7
Modifies the `nice` function to become an **anonymous** function. Call the anonymous function and pass in the parameter `x` and `y`.

```JavaScript
function main() {
    var x = "x";
    var y = "y";

    (function (x, y) {
      console.log(x, y);
    })(x, y);
}

main();
```

___
#### Question 8
Without running the code, what do you expect the following code to print?

**Ans:**
y x
x y

```JavaScript
function main() {
    var x = "x";
    var y = "y";

    (function nice(x, y) {
      console.log(y, x);
    })(x, y);

    nice(x, y);
}

main();
```

Run the code in LeetCode playground. What does it print? Why?

**Ans:**
y x
Error nice is not defined.

Why is the error raised?

**Ans:**
The nice function lives in the stack of the
`(function nice(x, y) {
    console.log(y, x);
})(x, y);`
The nice function outside has no access to it.
___
#### Question 9
Turn the `main` function into a closure, and immediately execute it after definition.

```JavaScript
(function() {
  var x = "x";
  var y = "y";

  function nice(x, y) {
    console.log(x, y);
  };

  nice(x, y);})()
```

In the closure you still need the function name `main`? Explain why.

**Ans:**
