"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isDroppedFile = isDroppedFile;

function isDroppedFile(rawEvent) {
  var e = rawEvent;

  if (!e.dataTransfer) {
    return false;
  }

  return Array.prototype.slice.call(e.dataTransfer.types).indexOf('Files') !== -1;
}