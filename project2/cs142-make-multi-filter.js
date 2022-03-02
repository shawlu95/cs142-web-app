'use strict';

//Take an input array and return a function that can be used to filter elements in the array.
function cs142MakeMultiFilter(originalArray) {
  var currentArray = originalArray;

  //
  function arrayFilterer(filterCriteria, callback){
    // If filterCriteria is not a function, the returned function (arrayFilterer)
    // should immediately return the value of currentArray with no filtering performed.
    if (typeof filterCriteria !== "function") {
      return currentArray;
    }

    // Update the array with the filterCriteria.
    currentArray = currentArray.filter(filterCriteria);

    if (typeof callback === "function") {
      callback.call(originalArray, currentArray); // Set "this" to the originalArray.
    }
    return arrayFilterer;
  }

  return arrayFilterer;
}
