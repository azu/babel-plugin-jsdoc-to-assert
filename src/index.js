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
export default function ({types: t, template}) {
  const injectAssert = (path, leadingComments, options) => {
    const converterOptions = useGenerator(options);
    const comment = leadingComments[leadingComments.length - 1];
    if (comment.type === 'CommentBlock') {
      const asserts = CommentConverter.toAsserts(comment, converterOptions);
      // no have assert, ignore this
      if (asserts.length === 0) {
        return;
      }
      const functionDeclarationString = trimSpaceEachLine(asserts).join("\n");
      const buildAssert = template(functionDeclarationString)();
      const bodyPath = path.get("body");
      if (bodyPath && bodyPath.node && bodyPath.node["body"]) {
        bodyPath.unshiftContainer("body", buildAssert);
      }
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
          const declaration = path.get('declarations')[0];
          if (declaration.isVariableDeclaration()) {
            return;
          }
          const init = declaration.get("init");
          if (!init) {
            return;
          }
          injectAssert(init, node.leadingComments, this.opts)
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
          injectAssert(declaration, node.leadingComments, this.opts)
        }
      },
      // method
      ["ObjectMethod|ClassMethod|FunctionDeclaration"](path){
        if (maybeSkip(path)) {
          return;
        }
        const {node} = path;
        injectAssert(path, node.leadingComments, this.opts);
      }
    }
  };
}