'use strict';

function logEvent(e, message) {
  console.log(message);
  console.log("e.target", e.target);
  console.log("e.currentTarget", e.currentTarget);
  console.log('target === currentTarget', e.target===e.currentTarget);
  console.log("");
}

// what is the target and currentTarget when user click
// A, B, C, and D?
document.getElementById("body").addEventListener("click", function (e) {
  logEvent(e, "Event listener captured by 'body'");
}, true);

document.getElementById("body").addEventListener("click", function (e) {
  logEvent(e, "Event listener bubbled by 'body'");
}, false);
