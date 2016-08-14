// LICENSE : MIT
"use strict";
/**
 * @param {Object} node
 * @returns {string|undefined}
 * @example
 *  this.value = "string"
 *  => return "this.value"
 *
 */
export function AssignmentExpressionLeftToString(node) {
  if (node.type !== "MemberExpression" && node.type !== "Identifier") {
    return;
  }
  if (node.type === "Identifier") {
    return node.name;
  }
  if (node.object.type === "ThisExpression") {
    return ["this", node.property.name].join('.')
  }
  return [node.object.name, node.property.name].join('.');
}