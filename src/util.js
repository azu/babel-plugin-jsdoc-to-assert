// LICENSE : MIT
"use strict";
export function trimSpaceEachLine(texts) {
  return texts
    .filter(line => line != null)
    .map(line => line.trim());
}