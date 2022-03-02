### Week 2
####  Universal Resource Locator [PDF](URLs.pdf)
* Link tag in HTML: `<a href="https://en.wikipedia.org/wiki/URL">URL</a>
`
* Parts of URL: `http://host.company.com:80/a/b/c.html?user=Alice&year=2008#p2`
    * Scheme: `http`, `https`, `file`, `mailto` (page 4).
    * Host name: `//host.company.com`
    * port number
    * Hierarchical portion `/a/b/c.html` (page 5).
    * Query parameters `?user=Alice&year=2008` (page 6)
    * Fragment `#p2`
* Full vs. relative URL (page 8).
* Anchor point:
    * Define: `<a name="sec3">`
    * Link: `<a href="#sec3">``
    * <a href="#top">Back to Top</a>

* Encoding special character: `%xx`, where xx is the hexadecimal value of the character (page 10).

* Hoisting to function start: `var val =...`.
    * Function definitions are hoisted (i.e. can use before define)
* Do not hoist: `let val = ...`.
* Primitive: number, string, boolean.
* Undefined vs. null (page 12):
    * `null == undefined` returns `True`
    * `null === undefined` returns `False`
    * Function return `undefined` by default.
* Object: Object is an unordered collection of name-value pairs called properties
    * Example: `var bar = {name: "Alice", age: 23, state: "California"};`.
    * Reference property: `bar.name` or `bar["name"]`.
    * Add/assign property: `bar.name = "Fred";`.
    * Remove property: `delete bar.name;`.
    * Get all property names: `bar.keys()`.
* Array:
    * Are special objects: `var anArr = [1,2,3];`.
    * Sparse and polymorphic: `[1,2,3,,,'FooBar']`.
* Dates: familiarize but do not memorize (page 18).
* Regular expression: familiarize but do not memorize  (page 19).
* Exception: familiarize but do not memorize  (page 22).
* Ways to import JavaScript:
    * import file in `<header>`: `<script type="text/javascript" src="code.js"></script>`.
    * Inline HTML:
    ```html
    <script type="text/javascript">
        //<![CDATA[
        Javascript goes here...
        //]]>
    </script>
    ```

####  JavaScript Programming [PDF](JavaScriptProgramming.pdf)
* For loop:
```JavaScript
for (var i = 0; i < anArr.length; i++) {
    newArr[i] = anArr[i]*i;
}
```
* `this`: in methods this will be bound to the object owning the methods (page 4).
* Function can have property. Example: invocation:
```JavaScript
function plus1(value) {
    if (plus1.invocations == undefined) {
        plus1.invocations = 0;
    }
    plus1.invocations++;
    return value + 1;
}
```
* Use functions as function (not as class): review [MultiFilter](../project2/cs142-make-multi-filter.js).
    * `originalArray` is stored as a local variable called `currentArray`.
    * `arrayFilterer` function is also stored as a local variable.
    * To call a function and receive its returned value (in this case, another function): `var filterFunc = cs142MakeMultiFilter(originalArray);`.

* Class & prototype programming: review [TemplateProcessor](../project2/cs142-template-processor.js).
    * To instantiate an instance:  
    * `template` is stored as a property of the class.
    * `fillIn` is a method of its `prototype` object, referenced as `Cs142TemplateProcessor.prototype.fillIn`.
    * To instantiate an instance of the class: `new Cs142TemplateProcessor(template);`
    * **Note**: Dynamic - changing prototype will cause all instances to change
* Inherit from superclass: `class Rectangle extends Shape { ... }`.
* Use closure to manage name scope (page 18):
```JavaScript
var myObj = (function() {
   var privateProp1 = 1;  
   var privateProp2 = "test";
   var setPrivate1 = function(val1)  { privateProp1 = val1; }
   var compute = function() {return privateProp1 + privateProp2;}
   return {compute: compute, setPrivate1: setPrivate1};
})();
typeof myObj;        // 'object'
Object.keys(myObj);  //  [ 'compute', 'setPrivate1' ]
```
* Use arrow function to preserve `this` (page 20):
```JavaScript
'use strict';
function readFileMethod() {
    fs.readFile(this.fileName, (err, data) => {
        if (!err) {
            console.log(this.fileName, 'has length', data.length);
        }
    });
}
var obj = {fileName: "aFile"; readFile: readFileMethod};
obj.readFile();
```
* Always use `===` and `!==`, because `==` and `!=` automatically convert types to boolean.
