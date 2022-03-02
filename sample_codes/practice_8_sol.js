// question 1
"use strict";
var x;
var color = 'blue';

function CrayonStore() {
  return function () {
    console.log("ha")
  };
}

f = new CrayonStore();

// f vs x: defined vs undefined
console.log("f", f) // function
console.log("x", x) // undefined
console.log("f && x", f && x) // undefined
console.log("x && f", x && f) // undefined
console.log("f || x", f || x) // function
console.log("x || f", x || f) // function

// x vs color: defined vs defined
console.log("color || x", color || x) // function
console.log("x || color", x || color) // function
console.log("color && f", color && f) // function
console.log("x && color", x && color) // function

// f vs color
console.log("color || f", color || f) // function
console.log("f || color", f || color) // function


// ---------------------------------------
// question 2
// var x;
var gColor = 'blue';
function CrayonStore() {
  var color = 'red';
  this.getFunc = function() {
    this.color = 'purple';
    return function() {
      console.log(typeof(this));
      console.log(this.color);
      console.log(this && this.color);
      console.log(color);
      console.log(gColor);
    };
  };
}

var crayonStore = new CrayonStore();
var func = crayonStore.getFunc();
func();
// object
// undefined
// undefined
// red
// blue

gColor = 'green';
crayonStore.color = 'black';
func();
// object
// undefined
// undefined
// red
// green
