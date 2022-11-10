"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isSelectionAtPlaceholder = void 0;

var _prosemirrorState = require("prosemirror-state");

var isSelectionAtPlaceholder = function isSelectionAtPlaceholder(selection) {
  if (!(selection instanceof _prosemirrorState.TextSelection) || !selection.$cursor) {
    return false;
  }

  var node = selection.$cursor.doc.nodeAt(selection.$cursor.pos);
  return (node === null || node === void 0 ? void 0 : node.type.name) === 'placeholder';
};

exports.isSelectionAtPlaceholder = isSelectionAtPlaceholder;