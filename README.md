# babel-plugin-jsdoc-to-assert [![Build Status](https://travis-ci.org/azu/babel-plugin-jsdoc-to-assert.svg?branch=master)](https://travis-ci.org/azu/babel-plugin-jsdoc-to-assert)

Babel plugin for [jsdoc-to-assert](https://github.com/azu/jsdoc-to-assert "jsdoc-to-assert").

This plugin JSDoc to assertion method for runtime testing.

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