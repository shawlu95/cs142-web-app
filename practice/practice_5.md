### Practice 5: Hoisting

**DO NOT** use LeetCode to test the code. For each problem, create a `.js` file in [sample_codes]() folder. For example, to run [practice_5.js](../sample_codes/practice_5.js), execute the following command in Terminal:

```bash
node practice_5.js
```

**Document** both your original answer (which may be incorrect) and correct answer. Take notes on why you got it wrong.

___
#### Question 1:
Without running the code, what do you expect the following code to print?

**Ans:** 1, 9, 5, 9

```JavaScript
"use strict";

x = 1;
var y = 9;

console.log(x, y);

var x = 5;

console.log(x, y);
```

Run the code in Terminal. What does it print?

**Ans:** same

If different from expected, explain why. What did you miss?

**Note:**

___
#### Question 2:
Without running the code, what do you expect the following code to print?

**Ans:** undefined, 9, 5, 9

```JavaScript
"use strict";

x = 1;
var y = 9;

console.log(x, y);

let x = 5;

console.log(x, y);
```

Run the code in Terminal. What does it print?

**Ans:** undefined Error

If different from expected, explain why. What did you miss?

**Note:** After undefined error the program won't continue.

___
#### Question 3:
Without running the code, what do you expect the following code to print?

**Ans:**
1, 9, 5, 2

```JavaScript
"use strict";

x = 1;
y = 9;

console.log(x, y);

var x = 5, y = 2;

console.log(x, y);

```

Run the code in Terminal. What does it print?

**Ans:** same

If different from expected, explain why. What did you miss?

**Note:**

___
#### Question 4:
Without running the code, what do you expect the following code to print?

**Ans:**
1, 9, 1, 9

```JavaScript
"use strict";

x = 1;
y = 9;

console.log(x, y);

var x, y;

console.log(x, y);

```

Run the code in Terminal. What does it print?

**Ans:** same

If different from expected, explain why. What did you miss?

**Note:**

___
#### Question 5:
Without running the code, what do you expect the following code to print?

**Ans:**
undefined

```JavaScript
"use strict";

x = 1;
y = 9;

console.log(x, y);

let x = 5;
var y;

console.log(x, y);
```

Run the code in Terminal. What does it print?

**Ans:** same

If different from expected, explain why. What did you miss?

**Note:**

___
#### Question 6:

Without running the code, what do you expect the following code to print?

**Ans:**
1, 9, 1, 2, 3, 9

```JavaScript
"use strict";
(function () {
    var x = 1;
    var y = 9;

    console.log(x, y);

    for (var x; x < 3; x++) {
        console.log(x);
    }

    ((x, y) => {
      console.log(x, y);
    })(x, y);
})();
```

Run the code in Terminal. What does it print?

**Ans:**
1 9
1
2
3 9

If different from expected, explain why. What did you miss?

**Note:** same but be more careful with the layout of the output

___
#### Question 7:

Without running the code, what do you expect the following code to print?

**Ans:**
1 9
0
1
2
3 9
3 9

```JavaScript
"use strict";
(function () {
    x = 1;
    var y = 9;

    console.log(x, y);

    for (var x = 0; x < 3; x++) {
        console.log(x);
    }

    console.log(x, y);

    ((x, y) => {
      console.log(x, y);
    })(x, y);
})();
```

Run the code in Terminal. What does it print?

**Ans:** same

If different from expected, explain why. What did you miss?

**Note:**

___
#### Question 8:
Without running the code, what do you expect the following code to print?

**Ans:**
1 9
0
1
2
3 9
3 9

```JavaScript
"use strict";
(function () {
    x = 1;
    var y = 9;

    console.log(x, y);

    for (var x = 0; x < 3; x++) {
        console.log(x);
    }

    console.log(x, y);

    (x, y => {
      console.log(x, y);
    })(x, y);
})();
```

Run the code in Terminal. What does it print?

**Ans:**
1 9
0
1
2
3 9
3 3
(This is a very rare case and most likely you will never see this. The point is to use parenthesis when passing multiple parameters in the arrow function)

Why does it behave differently from question 7? (pay attention to variable's color)

**Note:**
In the arrow function, if you want to pass in multiple parameters, remember to use parenthesis.

___
#### Question 9:
Without running the code, what do you expect the following code to print?

**Ans:**
undefined 9
0
1
2
3 9
3 9

```JavaScript
"use strict";
(function () {
    var y = 9;

    console.log(x, y);

    for (var x = 0; x < 3; x++) {
        console.log(x);
    }

    console.log(x, y);

    ((x, y) => {
      console.log(x, y);
    })(x, y);
})();
```

Run the code in Terminal. What does it print?

**Ans:**
same

If different from expected, explain why. What did you miss?

**Note:**

___
#### Question 10:
Without running the code, what do you expect the following code to print?

**Ans:**
0
1
2
3 9
3 9

```JavaScript
"use strict";
(function () {
    var y = 9;

    // console.log(x, y);

    for (var x = 0; x < 3; x++) {
        console.log(x);
    }

    console.log(x, y);

    ((x, y) => {
      console.log(x, y);
    })(x, y);
})();
```

Run the code in Terminal. What does it print?

**Ans:**
same

If different from expected, explain why. What did you miss?

**Note:**

___
#### Question 11:
Without running the code, what do you expect the following code to print?

**Ans:**
0
1
2
undefined Error

```JavaScript
"use strict";
(function () {
    var y = 9;

    // console.log(x, y);

    for (let x = 0; x < 3; x++) {
        console.log(x);
    }

    console.log(x, y);

    ((x, y) => {
      console.log(x, y);
    })(x, y);
})();
```

Run the code in Terminal. What does it print?

**Ans:** same

Why does it behave differently from question 10?

**Note:**
