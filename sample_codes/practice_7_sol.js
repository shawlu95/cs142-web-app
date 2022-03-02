// question 1
"use strict";
var a, b;

a = 1;
b = 1;
console.log(a == b); // true
console.log(a === b); // true

a = "abc";
b = "abc";
console.log(a == b); // true
console.log(a === b); // true

a = false;
b = "";
console.log(a == b); // true
console.log(a === b); // false

a = false;
b = 0;
console.log(a == b); // true
console.log(a === b); // false

a = [];
b = "";
console.log(a == b); // true
console.log(a === b); // false

a = [];
b = {};
console.log(a == false); // true
console.log(b == false); // false
console.log(a === false); // false
console.log(b === false); // false
console.log(a == b); // false
console.log(a === b); // false

a = {};
b = {};
console.log(a == b); // false
console.log(a === b); // false

a = [];
b = [];
console.log(a == b); // false
console.log(a === b); // false

a = [1, 2];
b = [1, 2];
console.log(a == b); // false
console.log(a === b); // false

// question 2
a = function () {
  console.log("ha")
};

b = function () {
  console.log("ha")
};

console.log(a == a) // true
console.log(a === a) // true

console.log(a == b) // false
console.log(a === b) // false

const c = a;
console.log(a == c) // true
console.log(a === c) // true

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

console.log(f == g); // false
console.log(f === g); // false

const h = new maker(); // he
const j = maker(); // he

console.log(f == h); // false
console.log(f === h); // false

console.log(g == j); // false
console.log(g === j); // false
