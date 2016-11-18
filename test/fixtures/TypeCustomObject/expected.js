/**
 * @type {MyObject}
 */
const value = {};
console.assert(typeof Symbol === "function" && typeof Symbol.hasInstance === "symbol" && typeof MyObject !== "undefined" && typeof MyObject[Symbol.hasInstance] === "function" ? MyObject[Symbol.hasInstance](value) : typeof MyObject === "undefined" || typeof MyObject !== "function" || value instanceof MyObject);