/**
 * @param {number} param - this is a param.
 * @param {string} b - this is a param.
 * @param {string[]} [c] - this is a param.
 */
const myFunc = (param, b, c) => {
  assert(typeof param === "number", 'Invalid JSDoc: typeof param === "number"');
  assert(typeof b === "string", 'Invalid JSDoc: typeof b === "string"');
};