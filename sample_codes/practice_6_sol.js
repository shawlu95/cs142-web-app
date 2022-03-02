// ---------------------------------------
function CrayonStore() {
  var color = 'red';
  console.log(this.color);

  return function () {
    console.log(this.color);
    console.log(color)
  };
}

f = new CrayonStore();
// undefined

f();
// undefined
// red

// ---------------------------------------
function CrayonStore() {
  this.color = 'red';
  console.log(this.color);

  return function () {
    console.log(this.color);
    console.log(color);
  };
}

f = new CrayonStore();
// red

f();
// undefined
// error


// ---------------------------------------
var color = 'blue'; // <-
function CrayonStore() {
  var color = 'red';
  console.log(this.color);

  return function () {
    console.log(this.color);
    console.log(color)
  };
}

f = new CrayonStore();
// undefined

f();
// undefined
// red

// ---------------------------------------
var color = 'blue';
function CrayonStore() {
  var color = 'red';
  console.log(this.color);

  return function () {
    var color = 'green'; // <-
    console.log(this.color);
    console.log(color)
  };
}

f = new CrayonStore();
// undefined

f();
// undefined
// green

// ---------------------------------------
function CrayonStore() {
  console.log(this);
  return function () {
    console.log(this);
  };
}

f = new CrayonStore();
// CrayonStore {}

f();
// Object [global]

// ---------------------------------------
function CrayonStore() {
  this.color = 'red';
  console.log(this.color);

  return function () {
    console.log(this.color);
  };
}

f = new CrayonStore();
// red

f();
// undefined
