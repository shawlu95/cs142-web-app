"use strict";

var async = require('async');

console.log('Before async.each');
async.each([10, 1],
  function eachFunc(arg, callback) {
    console.log('eachFunc start', arg);
    setTimeout(function () {
      console.log('eachFunc done', arg);
      callback();
    }, arg);
  },
  function doneFunc(arg) {
    console.log('doneFunc');
  }
);
console.log('After async.each');
