"use strict";
var x;
var color = 'blue';

function CrayonStore() {
  return function () {
    console.log("ha")
  };
}

var f = new CrayonStore();

// f vs x: defined vs undefined
console.log("f", f) //function() {...}
console.log("x", x) //undefined
console.log("f && x", f && x) //undefined
console.log("x && f", x && f) //undefined
console.log("f || x", f || x) //function() {...}
console.log("x || f", x || f) //function() {...}

// x vs color: defined vs defined
console.log("color || x", color || x) //blue
console.log("x || color", x || color) //blue
console.log("color && f", color && f) //function(){...}
console.log("x && color", x && color) //undefined

// f vs color
console.log("color || f", color || f) // blue
console.log("f || color", f || color) // function(){...}
