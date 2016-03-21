// LICENSE : MIT
"use strict";
function maybeSkip(path) {
  const {node} = path;
  if (node.leadingComments != null && node.leadingComments.length > 0) {
    return false;
  }
  return true;
}
import {Attachment} from "jsdoc-to-assert"
export default function ({types: t, template}) {
  const injectAssert = (path, leadingComments) => {
    const comment = leadingComments[0];
    if (comment.type === 'CommentBlock') {
      const functionDeclarationString = Attachment.FunctionDeclarationString(comment);
      const buildAssert = template(functionDeclarationString)();
      path.get("body").unshiftContainer("body", buildAssert);
    }
  };
  return {
    visitor: {
      // TODO: way?
      // ArrowFunctionExpression | VariableDeclaration
      // VariableDeclaration(path){
      //   if (maybeSkip(path)) {
      //     return;
      //   }
      //   const {node} = path;
      //   if (node.declarations) {
      //     node.declarations.forEach(declaration => {
      //       const declarator = t.variableDeclarator(declaration.id, declaration.init);
      //       console.log(declarator.unshiftContainer);
      //       injectAssert(declarator, node.leadingComments);
      //     });
      //   }
      // },
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
          injectAssert(declaration, node.leadingComments)
        }
      },
      // method
      ["ObjectMethod|ClassMethod|FunctionDeclaration"](path){
        if (maybeSkip(path)) {
          return;
        }
        const {node} = path;
        injectAssert(path, node.leadingComments);
      }
    }
  };
}