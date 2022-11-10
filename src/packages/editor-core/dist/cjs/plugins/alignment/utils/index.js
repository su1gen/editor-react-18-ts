"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getActiveAlignment = void 0;

var _prosemirrorUtils = require("prosemirror-utils");

var _cellSelection = require("@atlaskit/editor-tables/cell-selection");

var getActiveAlignment = function getActiveAlignment(state) {
  if (state.selection instanceof _cellSelection.CellSelection) {
    var marks = [];
    state.selection.forEachCell(function (cell) {
      var mark = cell.firstChild.marks.filter(function (mark) {
        return mark.type === state.schema.marks.alignment;
      })[0];
      marks.push(mark ? mark.attrs.align : 'start');
    });
    return marks.every(function (mark) {
      return mark === marks[0];
    }) ? marks[0] : 'start';
  }

  var node = (0, _prosemirrorUtils.findParentNodeOfType)([state.schema.nodes.paragraph, state.schema.nodes.heading])(state.selection);
  var getMark = node && node.node.marks.filter(function (mark) {
    return mark.type === state.schema.marks.alignment;
  })[0];
  return getMark && getMark.attrs.align || 'start';
};

exports.getActiveAlignment = getActiveAlignment;