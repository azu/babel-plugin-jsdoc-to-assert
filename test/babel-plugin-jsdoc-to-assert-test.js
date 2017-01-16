const assert = require('assert');
const fs = require('fs');
const path = require('path');
import '../src/';
import {transformFileSync} from 'babel-core';

function normalize(str) {
    return str.replace(/^\s+|\s+$/, '').replace(/\r?\n/g, '\n');
}

describe('JSDoc plugin', () => {
    const fixturesDir = path.join(__dirname, 'fixtures');
    fs.readdirSync(fixturesDir).map((caseName) => {
        it(`should generate assertions for ${caseName.replace(/-/g, ' ')}`, () => {
            const fixtureDir = path.join(fixturesDir, caseName);
            let actualPath = path.join(fixtureDir, 'actual.js');
            const actual = transformFileSync(actualPath).code;

            if (path.sep === '\\') {
                // Specific case of windows, transformFileSync return code with '/'
                actualPath = actualPath.replace(/\\/g, '/');
            }

            const expected = fs.readFileSync(
                path.join(fixtureDir, 'expected.js')
            ).toString().replace(/%FIXTURE_PATH%/g, actualPath);

            assert.equal(normalize(actual), normalize(expected));
        });
    });
});