### Week 3
#### DOM ([pdf](DOM.pdf))
* Root node: `window.document`
* Children of root node: `window.document.head`, `window.document.body`.
* Access node in JavaScript: `parent = document.getElementById("div42");`.
* Create elements:
    * `var new = document.createElement("P");`
    * `var btn = document.createElement("BUTTON"); `
* Add element to DOM tree:
    * Append to end: `parent.appendChild(new);`.
    * Insert before a sibling: `parent.insertBefore(element, sibling);`.
* Delete node: `parent.removeChild(new);`
* `offsetparent` vs `parent` (page 15):
    * Default offsetParent is the <body> element.
    * An element becomes `offsetparent` for all its children when one of the two conditions is satisfied:
        * (1) position CSS attribute is `absolute`
        * (2) position CSS attribute is `relative`
    * Walk through example (page 18-20).

#### Events ([pdf](Events.pdf))
* General event properties (page 5).
* Mouse event properties (page 6).
* Keyboard event properties (page 6).
* Add event listener in HTML (page 4):

```HTML
<div onclick="gotMouseClick('id42'); gotMouse=true;">...</div>
```

* Add event listener in JavaScript (page 4):

```JavaScript
element.onclick = mouseClick;
element.addEventListener("click", mouseClick);
```

* Example use case: multiple event registered on a rectangle object.

```HTML
<div id="div1" onmousedown="mouseDown(event);"
onmousemove="mouseMove(event);"
onmouseup="mouseUp(event);">Drag Me!</div>
```

```JavaScript
var isMouseDown = false;  // Dragging?
var prevX, prevY;

function mouseDown(event) {
    prevX = event.pageX;
    prevY = event.pageY;
    isMouseDown = true;
}

function mouseUp(event) { isMouseDown = false; }

function mouseMove(event) {
    if (!isMouseDown) {
        return;
    }
    var elem = document.getElementById("div1");
    elem.style.left = (elem.offsetLeft + (event.pageX - prevX)) + "px"; elem.style.top = (elem.offsetTop + (event.pageY - prevY)) + "px";
    prevX = event.pageX;
    prevY = event.pageY;
}
```

* Keyboard event: `keyCode` (alpha-numeric), `charCode` (unicode).
* **Capture phase and bubble phase (page 10).**
    * What is the order of propagation of each phase (start with innermost? outermost?).
    * How to stop propagation: add `event.stopPropagation()` in handler funciton.

#### Front End ([PDF](FrontEnd.pdf))
* Model: manages the application's data (page 11).
* View: what the web page looks like (page 13).
* Controller: Controller: fetch models and control view, handle user interactions (page 9).
