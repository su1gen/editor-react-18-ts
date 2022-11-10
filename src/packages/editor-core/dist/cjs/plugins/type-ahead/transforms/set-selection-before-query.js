"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setSelectionBeforeQuery = void 0;

var _prosemirrorState = require("prosemirror-state");

var setSelectionBeforeQuery = function setSelectionBeforeQuery(rawText) {
  return function (tr) {
    var currentPosition = tr.selection.$from.pos;
    var positionBeforeRawText = Math.max(currentPosition - rawText.length, 0);
    var resolvedPositionBeforeText = tr.doc.resolve(positionBeforeRawText);

    var nextSelection = _prosemirrorState.TextSelection.findFrom(resolvedPositionBeforeText, -1, true);

    if (nextSelection) {
      tr.setSelection(nextSelection);
    }
  };
};

exports.setSelectionBeforeQuery = setSelectionBeforeQuery;