var object = {
  /**
   * @param {number} x - this is a param.
   * @param {string} y - this is a param.
   */
  method(x, y) {
    console.assert(typeof x === "number");
    console.assert(typeof y === "string");
  }
};
