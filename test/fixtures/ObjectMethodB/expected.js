/**
 * Encapsulates all CLI behavior for eslint. Makes it easier to test as well as
 * for other Node.js programs to effectively run the CLI.
 * This is Errrrrrrrrr
 */
const cli = {
  /**
   * execute with cli options
   * @param {object} cliOptions
   * @param {string[]} files files are file path list
   * @param {string} [text]
   * @param {string} [stdinFilename]
   * @returns {Promise<number>} exit status
   */
  executeWithOptions(cliOptions, files, text, stdinFilename) {
    console.assert(typeof cliOptions === "object");
    console.assert(Array.isArray(files) && files.every(function (item) {
      return typeof item === "string";
    }));
  }
};