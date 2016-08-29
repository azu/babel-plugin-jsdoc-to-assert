/**
 * @param {number} x - this is a param.
 * @param {string[]} y - this is a param.
 */
function myFunc(x, y) {
  if (!(typeof x === "number")) {
    console.error('TypeError: babel-plugin-jsdoc-to-assert\nExpected type: @param {number} x\nActual value:', x);
    console.assert(typeof x === "number", 'Invalid JSDoc: typeof x === "number"');
  }

  if (!(Array.isArray(y) && y.every(function (item) {
    return typeof item === "string";
  }))) {
    console.error('TypeError: babel-plugin-jsdoc-to-assert\nExpected type: @param {Array.<string>} y\nActual value:', y);
    console.assert(Array.isArray(y) && y.every(function (item) {
      return typeof item === "string";
    }), 'Invalid JSDoc: Array.isArray(y) && y.every(function(item){ return (typeof item === "string"); })');
  }
}