// LICENSE : MIT
"use strict";
class SimpleGenerator {
  assert(expression) {
    return `console.assert(${expression});`;
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

export default function ({types: t, template}) {
  const injectAssert = (path, leadingComments, options) => {
    const isSimple = options.simple || false;
    const converterOptions = isSimple ? {
      Generator: SimpleGenerator
    } : {};
    const comment = leadingComments[leadingComments.length - 1];
    if (comment.type === 'CommentBlock') {
      const functionDeclarationString = CommentConverter.toAsserts(comment, converterOptions).map(line => line.trim()).join("\n");
      const buildAssert = template(functionDeclarationString)();
      path.get("body").unshiftContainer("body", buildAssert);
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