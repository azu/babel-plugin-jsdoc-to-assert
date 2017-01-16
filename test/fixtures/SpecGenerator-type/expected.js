/**
 * @type {string}
 */
const value = "s";
/**
 * @type {string[]}
 */
console.assert(typeof value === "string", 'Expected type: @type {string} value\nActual value:', value, '\nFailure assertion: typeof value === "string"');
const array = ["s"];
console.assert(Array.isArray(array) && array.every(function (item) {
  return typeof item === "string";
}), 'Expected type: @type {Array.<string>} array\nActual value:', array, '\nFailure assertion: Array.isArray(array) && array.every(function(item){ return (typeof item === "string"); })');
