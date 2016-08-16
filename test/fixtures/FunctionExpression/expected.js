const obj = {
  /**
   * @param {String} message Message.
   */
  log: function (message) {
    console.assert(typeof message === "string");

    console.log(message);
  }
};