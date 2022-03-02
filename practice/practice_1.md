### Practice 1

#### Task 1: Study Mid-term Exam
* Download the graded copy of mid-term exam. Place it in the [midterms](../midterms) folder. Commit and push to GitHub.
* Study problems where pointed were deducted. For each problem (or subproblem), highlight the concepts tested.
* For each problem or subproblem, summarize and clarify the confusion in **2~5** sentences. Do not copy-paste explanation from elsewhere. Use your own wording.
* Document your error and explanation in [错题集.md](../review/错题集.md). Follow consistent mark-down & organization style.

#### Task 2: Cataloging Concepts & Mark-down Practice
* Create a markdown file called `readme.md` in the `lectures` folder.
* Create a bullet list, one bullet for each lecture PDF.
* Organize the bullet list in chronological order (week 1 - week 10).
* The `readme.md` file in the weekly folders should help you quickly summarize the content of each lecture.
* Each bullet list should be the title of the lecture PDF, followed by two links:
  - One link points to the folder containing the lecture PDF.
  - One link points to the PDF itself.
* Under each bullet point, build a sublist in which each sub-bullet is a section title of the lecture PDF.
* You may want to omit, add or modify each sub-bullet.
See example:

* **NodeJS** ([week6](../lectures/week6), [NodeJS.pdf](../lectures/week6/NodeJS.pdf))
  * Event loop; event-based programming.
  * Listener/Emitter Pattern.
  * Stream.
  * A Common Pattern: Turning Waiting into a Callback

#### Task 3: Stack Space - Practice Problems
Answer the following questions by directly typing after `Ans:`. For each question, write down your reasoning in clear, concise manner after `Note:`.

**Question 1**: What does the following program print? Verify your answer in LeetCode playground, and take notes.

```JavaScript
for (var x = 5; x >= 0; x--) {
  setTimeout(function () {console.log(x);}, 10 * x);
}
```
**Ans:**
-1, -1, -1, -1, -1, -1

**Note:**
The x in `console.log(x)` is from outside (the for loop).

___
**Question 2**: Study the following blocks of code (same as problem 16 in mid-term) and answer the following questions:

```JavaScript
// A
for (var x = 1; x < 5; x++) {
    setTimeout(function () {console.log(x);}, 10 * x);
}
```

1. What is the definition of the anonymous function?

  **Ans**: `function () {console.log(x);}`


2. Can you call the anonymous function after the loop (Yes/No)?

  **Ans:**
  no

3. The value of `x` in the expression `console.log(x)` exists in whose stack space?
  - (A) same stack as the for-loop;
  - (B) stack space of the anonymous function.
  - **Ans:**
  A

**Note:**

___
**Question 3**: Study the following blocks of code (same as problem 16 in mid-term) and answer the following questions:

```JavaScript
// B
function f(a) {console.log(a);}
for (var x = 1; x < 5; x++) {
    setTimeout(function () { f(x); }, 10 * x);
}
```

1. What is the anonymous function in the code above?

  **Ans:**
  `function () { f(x); }`

2. What is the named function in the code above?

  **Ans:**
  `function f(a) {console.log(a);}`

3. For the variable `a` in expression `console.log(a);`, whose stack space does it belong to?
  - (A). function `f(a)`
  - (B). anonymous function.
  - **(C). same stack space the for loop occupies.**
  - **Ans:** C

**Note:**

___
**Question 4**:

```JavaScript
for (var x = 1; x < 5; x++) {
  setTimeout(function (x) {console.log(x);}, 10 * x);
}
```

1. What does the following code output?

  **Ans:**
  undefined, undefined, undefined, undefined

2. What parameter does the callback function take?

  **Ans:**
  This x should live in the scope that defines setTimeout, which does not exist.

3. How are the callback function's parameter set?
  - (A) Set by the `for` loop as `x` get incremented in each iteration.
  - (B) Set within the `setTimeout` method when it calls the callback.
  - **Ans:**
  B

**Note:**

___
**Question 5**: Modify the following code to make it print in correct order: `1, 2, 3, 4`. The method `setTimeout` should be called 4 times in a loop (x = 1, 2, 3, 4). Each time `setTimeout` gets called, the wait time (in milliseconds) should be `x * 10`. Verify your code in LeetCode playground.

*Note: you should write a function closure to preserve the state of the variable `x`.*

```JavaScript
function f(x) {setTimeout(function () {console.log(x);}, 10 * x);}
for (var x = 1; x < 5; x++) {
  f(x);
}

for (var x = 1; x < 5; x++) {
  (function (x) {setTimeout(function(){console.log(x);}, 10 * x)})(x);
}

```

Closure is in essence just a function.
Once in a function with parameter x passed into it,
it has its own name space and therefore can store the value of x.

```
| stack space for for (var x = 1; x < 5; x++) {} |
| f(x=1)  | f(x=2)  | f(x=3)  | f(x=4)  |
```

Do not proceed until you get the code right.

1. How is variable `x` passed into the function closure?

  **Ans:**
  As a primitive value it gets copied.

2. When does variable `x` gets copied into a different stack space? In which stack space does its **value** exist?

  **Ans:**
  The stack of the closure function

___
**Question 6**: Study the code below and answer the questions:

```JavaScript
function f(x) {
  // console.log(- x);
  setTimeout(function () {console.log(x);}, 10 * x);
}

for (var x = 1; x < 5; x++) {
  f(x);
}
```
1. What does the code output?

  **Ans:**
  1, 2, 3, 4

2. Why is it different from **Question 3**?

  **Ans:**
  Because the value of x is passed into f(x) as a copy and stored in f(x)'s stack.

3. Uncomment the line `console.log(- x);`, now what does the code output?

  **Ans:**
  -1,-2,-3,-4,1,2,3,4


4. For the variable `x` in expression `console.log(- x);`, in which stack space does its value exist (multiple answers may be correct)?
  - (A). **Inside** the named function `f(x) {...}`
  - (B). In anonymous function `function () {console.log(x);}`
  - (C). Same as `x` in expression `10 * x`
  - (D). Same as `x` in the for loop.
  - **Ans:**
  A, C
