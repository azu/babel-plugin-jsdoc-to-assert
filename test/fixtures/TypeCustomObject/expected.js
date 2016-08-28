/**
 * @type {MyObject}
 */
const value = {};
console.assert(typeof MyObject === "undefined" || typeof MyObject !== "function" || value instanceof MyObject);