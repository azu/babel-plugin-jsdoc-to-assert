// LICENSE : MIT
"use strict";
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
    return `assert(${trimmedExpression}, 'Invalid JSDoc param: ${trimmedExpression}');`;
  }
}
export class ThrowGenerator {
  assert(expression) {
    const trimmedExpression = trimSpaceEachLine(expression.split("\n")).join("");
    return `if(${trimmedExpression}){ throw new TypeError('Invalid JSDoc @param: ${trimmedExpression}'); }`;
  }
}
