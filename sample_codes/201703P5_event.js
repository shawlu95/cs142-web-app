'use strict';

// target vs currentTarget
document.getElementById("body").addEventListener("click",
  function (e) {
    console.log("e.target", e.target, "e.currentTarget", e.currentTarget);
    console.log('Body-true', e.target===e.currentTarget)
  }, true);

document.getElementById("body").addEventListener("click",
  function (e) {
    console.log("e.target", e.target, "e.currentTarget", e.currentTarget);
    console.log('Body-false', e.target===e.currentTarget)
  }, false);

document.getElementById("div").addEventListener("click",
  function (e) {
    console.log("e.target", e.target, "e.currentTarget", e.currentTarget);
    console.log('Div-true', e.target===e.currentTarget)
  }, true);

document.getElementById("div").addEventListener("click",
  function (e) {
    console.log("e.target", e.target, "e.currentTarget", e.currentTarget);
    console.log('Div-false', e.target===e.currentTarget)
  }, false);
