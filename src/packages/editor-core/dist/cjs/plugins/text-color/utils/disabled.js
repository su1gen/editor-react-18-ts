"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDisabledState = void 0;

var _mark = require("../../../utils/mark");

var hasLinkMark = function hasLinkMark($pos) {
  var linkMarkType = $pos.doc.type.schema.marks.link,
      pos = $pos.pos;

  if (!linkMarkType) {
    return false;
  }

  return $pos.doc.rangeHasMark(pos, Math.min(pos + 1, $pos.doc.content.size), linkMarkType);
};

var getDisabledState = function getDisabledState(state) {
  var textColor = state.schema.marks.textColor;

  if (textColor) {
    var _ref = state.selection,
        empty = _ref.empty,
        ranges = _ref.ranges,
        $cursor = _ref.$cursor;

    if (empty && !$cursor || $cursor && hasLinkMark($cursor) || (0, _mark.isMarkAllowedInRange)(state.doc, ranges, textColor) === false) {
      return true;
    }

    if ((0, _mark.isMarkExcluded)(textColor, state.storedMarks || $cursor && $cursor.marks())) {
      return true;
    }

    return false;
  }

  return true;
};

exports.getDisabledState = getDisabledState;