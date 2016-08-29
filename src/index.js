// LICENSE : MIT
"use strict";
import {CommentConverter} from "jsdoc-to-assert"
import {AssignmentExpressionLeftToString} from "./ast-util";
import {trimSpaceEachLine} from "./util";
import {NodeAssertGenerator, SimpleGenerator, ThrowGenerator, SpecGenerator} from "./generators";
/**
 * `comment` node contain @type, return true
 * @param {Object} comment
 * @returns {boolean}
 */
function containTypeComment(comment) {
  if (comment == null) {
    return false;
  }
  return /@type/.test(comment.value);
}
/**
 * if the `path` have not comments, return true
 * @param {Object} path
 * @returns {boolean}
 */
function maybeSkip(path) {
  const {node} = path;
  if (node.leadingComments != null && node.leadingComments.length > 0) {
    return false;
  }
  return true;
}

/**
 * @param {Object} [options]
 * @returns {{Generator: *}}
 */
function useGenerator(options = {}) {
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
  // use `assert` module
  // It depended on https://github.com/azu/babel-plugin-auto-import-assert
  if (options.useNodeAssert) {
    return {
      Generator: NodeAssertGenerator
    }
  }
  // Default: SpecGenerator
  // Readable output for human
  return {
    Generator: SpecGenerator
  };
}
export default function({types: t, template}) {
  // work only { checkAtType: true }
  const injectTypeAssert = (declarationsPath, identifierName, leadingComments, options) => {
    if (!options.checkAtType) {
      return;
    }
    const converterOptions = useGenerator(options);
    const comment = leadingComments[leadingComments.length - 1];
    if (comment.type !== 'CommentBlock') {
      return;
    }
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
  // work only { checkAtParam: true|undefined }
  const injectParameterAssert = (path, leadingComments, options) => {
    // default: enable
    if (options.checkAtParam === false) {
      return;
    }
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
      ["AssignmentExpression"](path){
        const parentPath = path.parentPath;
        if (maybeSkip(parentPath)) {
          return;
        }
        const {node} = path;
        const leadingComments = parentPath.node.leadingComments;
        if (leadingComments == null) {
          return;
        }
        const identifierName = AssignmentExpressionLeftToString(node.left);
        const isTypeComments = leadingComments.some(containTypeComment);
        if (identifierName && isTypeComments) {
          injectTypeAssert(path, identifierName, leadingComments, this.opts);
        }
      },
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
            if (firstDeclaration.node.id == null) {
              return;
            }
            if (firstDeclaration.node.id.type !== "Identifier") {
              return;
            }
            const identifierName = firstDeclaration.node.id.name;
            injectTypeAssert(path, identifierName, leadingComments, this.opts);
          } else {
            injectParameterAssert(init, leadingComments, this.opts)
          }
        }
      },
      ["FunctionExpression"](path){
        if (maybeSkip(path.parentPath)) {
          return;
        }
        const leadingComments = path.parentPath.node.leadingComments;
        if (leadingComments == null) {
          return;
        }
        injectParameterAssert(path, leadingComments, this.opts);
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