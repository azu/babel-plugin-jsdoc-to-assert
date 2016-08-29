// LICENSE : MIT
"use strict";
const doctrine = require("doctrine");
import {trimSpaceEachLine} from "./util";
export class SimpleGenerator {
  assert(expression) {
    const trimmedExpression = trimSpaceEachLine(expression.split("\n")).join("");
    return `console.assert(${trimmedExpression});`;
  }
}
export class NodeAssertGenerator {
  assert(expression) {
    const trimmedExpression = trimSpaceEachLine(expression.split("\n")).join("");
    return `assert(${trimmedExpression}, 'Invalid JSDoc: ${trimmedExpression}');`;
  }
}
export class SpecGenerator {
  constructor(tag) {
    this.nameOfValue = tag.name;
    this.typeString = doctrine.type.stringify(tag.type, {compact: true});
    this.jsdocLikeString = `@${tag.title} {${this.typeString}} ${tag.name}`;
  }

  assert(expression) {
    const trimmedExpression = trimSpaceEachLine(expression.split("\n")).join("");
    const title = `TypeError: babel-plugin-jsdoc-to-assert`;
    const expectedMessage = `Expected type: ${this.jsdocLikeString}`;
    const actualMessage = `Actual value:`;
    const actualValue = this.nameOfValue;
    return `if(!(${trimmedExpression})){
      console.error('${title}\\n${expectedMessage}\\n${actualMessage}', ${actualValue});
      console.assert(${trimmedExpression}, 'Invalid JSDoc: ${trimmedExpression}');
}`;
  }
}
export class ThrowGenerator {
  assert(expression) {
    const trimmedExpression = trimSpaceEachLine(expression.split("\n")).join("");
    return `if(!(${trimmedExpression})){ throw new TypeError('Invalid JSDoc: ${trimmedExpression}'); }`;
  }
}
