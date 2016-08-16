# babel-plugin-jsdoc-to-assert [![Build Status](https://travis-ci.org/azu/babel-plugin-jsdoc-to-assert.svg?branch=master)](https://travis-ci.org/azu/babel-plugin-jsdoc-to-assert)

Babel plugin for [jsdoc-to-assert](https://github.com/azu/jsdoc-to-assert "jsdoc-to-assert").

Preset version: [babel-preset-jsdoc-to-assert: Babel preset for jsdoc-to-assert](https://github.com/azu/babel-preset-jsdoc-to-assert)

This plugin JSDoc(`@param` and `@type`) to assertion method for runtime testing.

## `@param`

```js
/**
 * @param {number} param - this is a param.
 * @param {string} b - this is a param.
 * @param {string[]} [c] - this is a param.
 */
function myFunc(param, b, c) {
}
```

to

```js
/**
 * @param {number} param - this is a param.
 * @param {string} b - this is a param.
 * @param {string[]} [c] - this is a param.
 */
function myFunc(param, b, c) {
  console.assert(typeof param === 'number');
  console.assert(typeof b === 'string');
}
```

### `@type`

```js
/**
 * @type {string}
 */
const value = "s";
```

to 

```js
/**
 * @type {string}
 */
const value = "s";
console.assert(typeof value === "string");
```

## Installation

    npm install babel-plugin-jsdoc-to-assert

## Usage

Via `.babelrc`

```json
{
  "plugins": [
    "jsdoc-to-assert"
  ]
}
```

In development only:

```json
{
  "presets": [
    "es2015"
  ],
  "env": {
    "development": {
      "plugins": [
        "jsdoc-to-assert"
      ]
    }
  }
}
```

If build files with `NODE_ENV=production`, don't convert JSDoc to assert.

    "build": "NODE_ENV=production babel src --out-dir lib --source-maps",

## Options

- `checkAtParam`: boolean
    - Default: `true`
    - Check typing of `@param`
- `checkAtType`: boolean
    - Default: `false`
    - Check typing of `@type` 

## FAQ

Q. Try to use this, but throw parsing error:

```
ERROR in ./src/js/framework/Context.js
Module build failed: SyntaxError: Unterminated string constant (3:16)
    at Parser.pp.raise (/Users/azu/.ghq/github.com/azu/svg-feeling/node_modules/babylon/index.js:1378:13)
    at Parser.readString (/Users/azu/.ghq/github.com/azu/svg-feeling/node_modules/babylon/index.js:5402:49)
    at Parser.getTokenFromCode (/Users/azu/.ghq/github.com/azu/svg-feeling/node_modules/babylon/index.js:52
    ....
 @ ./src/index.js 24:15-48
```

A. It seem to be a bug of `babel-plugin-jsdoc-to-assert`.
Please file issue with your code :bow:

Q. Why `checkAtType` is default disable?

It is a problem of babel transform order.

ES2015 -> jsdoc-to-assert cause following problem.

```
AssertionError: Invalid JSDoc: typeof _this === "string"
+ expected - actual
```

## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
