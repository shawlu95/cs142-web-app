### Practice 5B: Hoisting & Loop Closure

#### Case Study
Understanding JavaScript Closures in For Loops [Lincccfrjk](https://decembersoft.com/posts/understanding-javascript-closures-in-for-loops/).

#### Question 1:

```JavaScript
var i = 8;
for (i; i <= 9; i++) {
  console.log(i);
}
console.log(i);
```
// 8
// 9
// 10


**Note:**


___
#### Question 2:

```JavaScript
i = 8;
for (var i; i <= 9; i++) {
  console.log(i);
}
console.log(i);
```
//error

**Note:**

___
#### Question 3:

```JavaScript
var i = 8;
for (i; i <= 9; i++) {
  console.log(i);
}
console.log(i);
```
//8
//9
//10

**Note:**

___
#### Question 4:

```JavaScript
var i = 8;
for (var a; a <= 9; a++) {
  console.log(a);
}
console.log(a);
```
//error

**Note:**

___
#### Question 5:

```JavaScript
var i = 8;
for (var a; a <= 9; a++) {
  console.log(a);
  var b = 12 + a;
}
console.log(b);
```
//undefined

**Note:**
Here a<=9 will be false and it will exit the loop and print log(b), which is undefined.

___
#### Question 6:

```JavaScript
var b = 8;
for (var a = 8; a <= 9; a++) {
  b = b + a;
  console.log(a);
  console.log(b);
}
console.log(b);

```
//error

**Note:**

___
#### Question 7:

```JavaScript
var b = 8;
for (var a = 8; a <= 9; a++) {
  b = b + a;
  console.log(a);
  console.log(b);
}
console.log(b);
```
//8
//16
//9
//25
//25


**Note:**
