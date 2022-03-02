"use strict";
function TableTemplate() {}
TableTemplate.fillIn = function(id, dict, columnName) {
    var table = document.getElementById(id);// retrieve table from DOM tree
    var tBody = table.tBodies[0];           // table can have many bodies (in array), pick the first one (in this case, the only one) 
    var headers = tBody.rows[0];            // first row is headers
    var nrows = tBody.rows.length;          // to be used later in nested loop
    var ncols = headers.cells.length;       // to be used later in nested loop
    var tp = new Cs142TemplateProcessor();  // make one template processor and reuse it
    var r, c, targetCol;                    // declare index variables, initialize to none

    function fillCell(tp, tBody, r, c, dict) {
        // utility function, replaces the content of a cell
        var cell = tBody.rows[r].cells[c];  // retrieve cell by row and column index
        tp.template = cell.textContent;     // update template processor's template
        cell.textContent = tp.fillIn(dict); // fill-in content
    }

    // fill all headers (r = 0), and find the specific column to be filled (if specified)
    for (c = 0; c < ncols; c ++) {
        fillCell(tp, tBody, 0, c, dict);
        if (headers.cells[c].textContent === columnName) { targetCol = c; }
    }

    // fill table's content, starting with second row (r = 1)
    for (r = 1; r < nrows; r ++) {
        if (columnName) {
            // if a column is speficied, fill that column only
            fillCell(tp, tBody, r, targetCol, dict);
        } else {
            // if no column is specified, fill every column
            for (c = 0; c < ncols; c ++) { fillCell(tp, tBody, r, c, dict); }
        }
    }
    table.style.visibility = "visible";
};