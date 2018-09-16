const assert = require('assert');
const fs = require('fs');
const path = require('path');
import { transformFileSync } from '@babel/core';

function normalize(str) {
  return str.replace(/^\s+|\s+$/, '').replace(/\r?\n/g, '\n');
}

describe('JSDoc plugin', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    it(`should generate assertions for ${caseName.replace(/-/g, ' ')}`, function() {
      const fixtureDir = path.join(fixturesDir, caseName);
      let actualPath = path.join(fixtureDir, 'actual.js');
      const actual = transformFileSync(actualPath).code;

      if (path.sep === '\\') {
        // Specific case of windows, transformFileSync return code with '/'
        actualPath = actualPath.replace(/\\/g, '/');
      }

      const expectedPath = path.join(fixtureDir, 'expected.js');
      const expected = fs.readFileSync(
        expectedPath
      ).toString().replace(/%FIXTURE_PATH%/g, actualPath);

      // UPDATE_SNAPSHOT=1 npm test で呼び出したときはスナップショットを更新
      if (process.env.UPDATE_SNAPSHOT) {
        fs.writeFileSync(expectedPath, actual);
        this.skip(); // スキップ
        return;
      }
      assert.equal(normalize(actual), normalize(expected));
    });
  });
});
