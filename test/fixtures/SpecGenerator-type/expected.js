/**
 * @type {string}
 */
const value = "s";
/**
 * @type {string[]}
 */

if (!(typeof value === "string")) {
  console.warn('TypeError: babel-plugin-jsdoc-to-assert\nExpected type: @type {string} value\nActual value:', value);
  console.assert(typeof value === "string", 'Invalid JSDoc: typeof value === "string"');
}

const array = ["s"];

if (!(Array.isArray(array) && array.every(function (item) {
  return typeof item === "string";
}))) {
  console.warn('TypeError: babel-plugin-jsdoc-to-assert\nExpected type: @type {Array.<string>} array\nActual value:', array);
  console.assert(Array.isArray(array) && array.every(function (item) {
    return typeof item === "string";
  }), 'Invalid JSDoc: Array.isArray(array) && array.every(function(item){ return (typeof item === "string"); })');
}