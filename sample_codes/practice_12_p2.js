'use strict';

function logEvent(e, message) {
  console.log(message);
  console.log("e.target", e.target);
  console.log("e.currentTarget", e.currentTarget);
  console.log('target === currentTarget', e.target===e.currentTarget);
  console.log("");
}

// what is the sequence of event when user clicks D?

// target vs currentTarget
document.getElementById("body").addEventListener("click", function (e) {
  logEvent(e, "Event listener captured by 'body'");
}, true);

// "false" means bubble phase
document.getElementById("body").addEventListener("click", function (e) {
  logEvent(e, "Event listener bubbled by 'body'");
}, false);

// "true" means capture
document.getElementById("D").addEventListener("click", function (e) {
  logEvent(e, "Event listener captured by 'D'");
}, true);

// "false" means bubble phase
document.getElementById("D").addEventListener("click", function (e) {
  logEvent(e, "Event listener bubbled by 'D'");
}, false);
