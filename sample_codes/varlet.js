"use strict";
// to execute: node varlet.js
function fragAVar() {
  console.log("Fragment A: var");
  try {
    i = 10
    for (var i = 0; i < 5; i ++) {
      console.log(i);
    }
    console.log(i);
  } catch (err) {
    console.log("Error");
  }
  console.log("");
}

function fragALet() {
  console.log("Fragment A: let");
  try {
    // in strict: use without declaration?
    i = 10
    for (let i = 0; i < 5; i ++) {
      console.log(i);
    }
    console.log(i);
  } catch (err) {
    console.log("Error");
  }
  console.log("");
}

function fragBVar() {
  console.log("Fragment B: var");
  try {
    for (var i = 0; i < 5; i ++) {
      console.log(i);
    }
    console.log(i);
  } catch (err) {
    console.log("Error");
  }
  console.log("");
}

function fragBLet() {
  console.log("Fragment B: let");
  try {
    // in strict: does not exist outside of loop
    for (let i = 0; i < 5; i ++) {
      console.log(i);
    }
    console.log(i);
  } catch (err) {
    console.log("Error");
  }
  console.log("");
}

(function main() {
  fragAVar();
  fragALet();
  fragBVar();
  fragBLet();
})();
