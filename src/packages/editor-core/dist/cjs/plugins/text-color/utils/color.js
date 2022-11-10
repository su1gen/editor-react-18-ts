"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActiveColor = exports.DEFAULT_COLOR = void 0;

var _colors = require("@atlaskit/theme/colors");

var DEFAULT_COLOR = {
  color: _colors.N800.toLowerCase(),
  label: 'Dark gray'
};
exports.DEFAULT_COLOR = DEFAULT_COLOR;

var getActiveColor = function getActiveColor(state) {
  var _ref = state.selection,
      $from = _ref.$from,
      $to = _ref.$to,
      $cursor = _ref.$cursor;
  var _ref2 = state.schema.marks,
      textColor = _ref2.textColor; // Filter out other marks

  var marks = [];

  if ($cursor) {
    marks.push(textColor.isInSet(state.storedMarks || $cursor.marks()) || undefined);
  } else {
    state.doc.nodesBetween($from.pos, $to.pos, function (currentNode) {
      if (currentNode.isLeaf) {
        var mark = textColor.isInSet(currentNode.marks) || undefined;
        marks.push(mark);
        return !mark;
      }

      return true;
    });
  } // Merge consecutive same color marks


  var prevMark;
  marks = marks.filter(function (mark) {
    if (mark && prevMark && mark.attrs.color === prevMark.attrs.color) {
      return false;
    }

    prevMark = mark;
    return true;
  });
  var marksWithColor = marks.filter(function (mark) {
    return !!mark;
  }); // When multiple colors are selected revert back to default color

  if (marksWithColor.length > 1 || marksWithColor.length === 1 && marks.length > 1) {
    return null;
  }

  return marksWithColor.length ? marksWithColor[0].attrs.color : DEFAULT_COLOR.color;
};

exports.getActiveColor = getActiveColor;