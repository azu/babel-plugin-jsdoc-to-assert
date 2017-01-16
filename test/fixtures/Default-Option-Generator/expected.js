/**
 * @param {number} x - this is a param.
 * @param {string[]} y - this is a param.
 */
function myFunc(x, y) {
  console.assert(typeof x === "number", 'Expected type: @param {number} x\nActual value:', x, '\nFailure assertion: typeof x === "number"');
  console.assert(Array.isArray(y) && y.every(function (item) {
    return typeof item === "string";
  }), 'Expected type: @param {Array.<string>} y\nActual value:', y, '\nFailure assertion: Array.isArray(y) && y.every(function(item){ return (typeof item === "string"); })');
}