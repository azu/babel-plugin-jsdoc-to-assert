// LICENSE : MIT
"use strict";
class SimpleGenerator {
  assert(expression) {
    return `console.assert(${expression});`;
  }
}
class NodeAssertGenerator {
  assert(expression) {
    return `assert(${expression});`;
  }
}
function maybeSkip(path) {
  const {node} = path;
  if (node.leadingComments != null && node.leadingComments.length > 0) {
    return false;
  }
  return true;
}
import {CommentConverter} from "jsdoc-to-assert"

function useGenerator(options = {}) {
  if (options.simple) {
    return {
      Generator: SimpleGenerator
    }
  }
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
      const functionDeclarationString = asserts
        .filter(line => line != null)
        .map(line => line.trim()).join("\n");
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
      ExportNamedDeclaration(path){
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