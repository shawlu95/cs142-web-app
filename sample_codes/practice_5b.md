### Practice 5B: Hoisting & Loop Closure

#### Case Study
Understanding JavaScript Closures in For Loops [Link](https://decembersoft.com/posts/understanding-javascript-closures-in-for-loops/).

#### Question 1:

```JavaScript
var i = 8;
for (i; i <= 9; i++) {
  console.log(i);
}
console.log(i);

// 8, 9, 10
```

___
#### Question 2:

```JavaScript
i = 8;
for (var i; i <= 9; i++) {
  console.log(i);
}
console.log(i);

// 8, 9, 10
```

___
#### Question 3:

```JavaScript
var i = 8;
for (i; i <= 9; i++) {
  console.log(i);
}
console.log(i);

// 8, 9, 10
```

___
#### Question 4:

```JavaScript
var i = 8;
for (var a; a <= 9; a++) {
  console.log(a);
}
console.log(a);

// undefined
```

___
#### Question 5:

```JavaScript
var i = 8;
for (var a; a <= 9; a++) {
  console.log(a);
  var b = 12 + a;
}
console.log(b);

// undefined
```

___
#### Question 6:

```JavaScript
var b = 8;
for (var a = 8; a <= 9; a++) {
  var b = b + a;
  console.log(a);
  console.log(b);
}
console.log(b);

// 8
// 16
// 9
// 25
// 25
```

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

// 8
// 16
// 9
// 25
// 25
```

___
#### Question 8:

```JavaScript
b = 8;
for (var a = 8; a <= 9; a++) {
  var b = b + a;
  console.log(a);
  console.log(b);
}
console.log(b);

// 8
// 16
// 9
// 25
// 25
```
