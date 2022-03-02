"use strict";
(function () {
    var y = 9;

    // console.log(x, y);

    for (let x = 0; x < 3; x++) {
        console.log(x);
    }

    console.log(x, y);

    ((x, y) => {
      console.log(x, y);
    })(x, y);
})();
