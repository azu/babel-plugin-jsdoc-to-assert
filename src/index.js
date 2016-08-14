// LICENSE : MIT
"use strict";
import {CommentConverter} from "jsdoc-to-assert"

function trimSpaceEachLine(texts) {
  return texts
    .filter(line => line != null)
    .map(line => line.trim());
}
class SimpleGenerator {
  assert(expression) {
    const trimmedExpression = trimSpaceEachLine(expression.split("\n")).join("");
    return `console.assert(${trimmedExpression});`;
  }
}
class NodeAssertGenerator {
  assert(expression) {
    const trimmedExpression = trimSpaceEachLine(expression.split("\n")).join("");
    return `assert(${trimmedExpression}, 'Invalid JSDoc param: ${trimmedExpression}');`;
  }
}
class ThrowGenerator {
  assert(expression) {
    const trimmedExpression = trimSpaceEachLine(expression.split("\n")).join("");
    return `if(${trimmedExpression}){ throw new TypeError('Invalid JSDoc @param: ${trimmedExpression}'); }`;
  }
}

/**
 * `comment` node contain @type, return true
 * @param {Object}comment
 * @returns {boolean}
 */
function containTypeComment(comment) {
  if (comment == null) {
    return false;
  }
  return /@type/.test(comment.value);
}
function maybeSkip(path) {
  const {node} = path;
  if (node.leadingComments != null && node.leadingComments.length > 0) {
    return false;
  }
  return true;
}

function useGenerator(options = {}) {
  // default: console.assert

  // more simple console.assert
  if (options.simple) {
    return {
      Generator: SimpleGenerator
    }
  }
  // throw new Error
  if (options.throw) {
    return {
      Generator: ThrowGenerator
    }
  }
  // assert
  if (options.useNodeAssert) {
    return {
      Generator: NodeAssertGenerator
    }
  }
  return {};
}
export default function({types: t, template}) {
  const injectTypeAssert = (declarationsPath, targetPath, leadingComments, options) => {
    const converterOptions = useGenerator(options);
    const comment = leadingComments[leadingComments.length - 1];
    if (comment.type !== 'CommentBlock') {
      return;
    }
    if (targetPath.node.id == null) {
      return;
    }
    if (targetPath.node.id.type !== "Identifier") {
      return;
    }
    const identifierName = targetPath.node.id.name;
    const asserts = CommentConverter.toTypeAsserts(identifierName, comment, converterOptions);
    // no have assert, ignore this
    if (asserts.length === 0) {
      return;
    }
    const functionDeclarationString = trimSpaceEachLine(asserts).join("\n");
    const builtAssert = template(functionDeclarationString)();
    if (builtAssert) {
      declarationsPath.insertAfter(builtAssert);
    }
  };
  const injectParameterAssert = (path, leadingComments, options) => {
    const converterOptions = useGenerator(options);
    const comment = leadingComments[leadingComments.length - 1];
    if (comment.type !== 'CommentBlock') {
      return;
    }
    const asserts = CommentConverter.toAsserts(comment, converterOptions);
    // no have assert, ignore this
    if (asserts.length === 0) {
      return;
    }
    const functionDeclarationString = trimSpaceEachLine(asserts).join("\n");
    const builtAssert = template(functionDeclarationString)();
    const bodyPath = path.get("body");
    if (bodyPath && bodyPath.node && bodyPath.node["body"]) {
      bodyPath.unshiftContainer("body", builtAssert);
    }
  };
  return {
    visitor: {
      ["ArrowFunctionExpression|VariableDeclaration"](path){
        if (maybeSkip(path)) {
          return;
        }
        const {node} = path;
        if (node.declarations) {
          const firstDeclaration = path.get('declarations')[0];
          if (firstDeclaration.isVariableDeclaration()) {
            return;
          }
          const init = firstDeclaration.get("init");
          if (!init) {
            return;
          }
          const leadingComments = node.leadingComments;
          const isTypeComments = leadingComments.some(containTypeComment);
          if (isTypeComments) {
            injectTypeAssert(path, firstDeclaration, leadingComments, this.opts)
          } else {
            injectParameterAssert(init, leadingComments, this.opts)
          }
        }
      },
      ["ExportNamedDeclaration|ExportDefaultDeclaration"](path){
        if (maybeSkip(path)) {
          return;
        }
        const {node} = path;
        if (node.declaration) {
          let declaration = path.get("declaration");
          if (declaration.isVariableDeclaration()) {
            return;
          }
          injectParameterAssert(declaration, node.leadingComments, this.opts)
        }
      },
      // method
      ["ObjectMethod|ClassMethod|FunctionDeclaration"](path){
        if (maybeSkip(path)) {
          return;
        }
        const {node} = path;
        injectParameterAssert(path, node.leadingComments, this.opts);
      }
    }
  };
}