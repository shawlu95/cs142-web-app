### Practice 9
What does the following code print?

#### Question 1
```JavaScript
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

objectFunc.green();
objectFunc.blue();
console.log(objectFunc);
```

undefined
undefined
``{green: function() {console.log(colors[idx]);},
   blue: function() {console.log(colors[idx]);}}``
**Note:**
Since in the returned retObj, the anonymous function is only defined rather than executed, colors[index] will not really take in the idx in the loop. When it is really called later in objectFunc.green(), the anonymous function looks for idx which is now 2. Therefore colors[idx] is undefined.

___
#### Question 2
```JavaScript
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

console.log(objectFunc.green);
console.log(objectFunc.blue);
console.log(objectFunc);
```
green
blue
``{green: green, blue: blue}``
**Note:**
