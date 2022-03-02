// ---------------------------------------
function CrayonStore() {
    this.getFuncObject = function() {
        var colors = ['green', 'blue'];
        var retObj = {};
        for (var idx = 0; idx < colors.length; idx++) {
            retObj[colors[idx]] = function() {
                console.log(colors[idx]);
            };
        }
        return retObj;
    };
}

var crayonStore = new CrayonStore();
var objectFunc = crayonStore.getFuncObject();

objectFunc.green(); // undefined
objectFunc.blue(); // undefined
console.log(objectFunc); // { green: [Function], blue: [Function] }

// ---------------------------------------
function CrayonStore() {
    this.getFuncObject = function() {
        var colors = ['green', 'blue'];
        var retObj = {};
        for (var idx = 0; idx < colors.length; idx++) {
            retObj[colors[idx]] = colors[idx];
        }
        return retObj;
    };
}

var crayonStore = new CrayonStore();
var objectFunc = crayonStore.getFuncObject();
console.log(objectFunc.green); // green
console.log(objectFunc.blue); // blue
console.log(objectFunc); // { green: 'green', blue: 'blue' }
