### Practice 7: Double vs. Triple Equal

#### Question 1

Note: values that are always falsy:
0,
false,
"",
null,
undefined,
NaN

```JavaScript
"use strict";
var a, b;

a = 1;
b = 1;
console.log(a == b); // T
console.log(a === b); // T

a = "abc";
b = "abc";
console.log(a == b); // T
console.log(a === b); // T

a = false;
b = "";
console.log(a == b); // T
console.log(a === b); // F

a = false;
b = 0;
console.log(a == b); // T
console.log(a === b); // F

a = [];
b = "";
console.log(a == b); // T
console.log(a === b); // F

a = [];
b = {};
console.log(a == false); // T
console.log(b == false); // F
console.log(a === false); // F
console.log(b === false); // F
console.log(a == b); //F
console.log(a === b); //F

a = {};
b = {};
console.log(a == b); //F
console.log(a === b); //F

a = [];
b = [];
console.log(a == b); //F
console.log(a === b); //F

a = [];
b = a;
console.log(a == b); //T
console.log(a === b); //T

a = [1, 2];
b = [1, 2];
console.log(a == b);//F
console.log(a === b);//F
```

___
#### Question 2

```JavaScript
"use strict";
const a = function () {
  console.log("ha")
};

const b = function () {
  console.log("ha")
};

console.log(a == a) //F
console.log(a === a) //F

console.log(a == b) //F
console.log(a === b)//F

const c = a;
console.log(a == c) //T
console.log(a === c) //T

function maker() {
  console.log("he");
  return function () {
    console.log("ha")
  };
}

const f = new maker(); // he
const g = maker(); // he

f(); // ha
g(); // ha

console.log(f == g); // F
console.log(f === g); // F

const h = new maker(); // he
const j = maker(); // he

console.log(f == h); //F
console.log(f === h); //F

console.log(g == j); //F
console.log(g === j); //F
```
