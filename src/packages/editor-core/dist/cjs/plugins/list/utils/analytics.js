"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCommonListAnalyticsAttributes = exports.countListItemsInSelection = void 0;

var _node = require("./node");

var _selection = require("./selection");

var getCommonListAnalyticsAttributes = function getCommonListAnalyticsAttributes(state) {
  var _state$selection = state.selection,
      $from = _state$selection.$from,
      $to = _state$selection.$to;
  var fromAttrs = (0, _selection.getListItemAttributes)($from);
  var toAttrs = (0, _selection.getListItemAttributes)($to);
  return {
    itemIndexAtSelectionStart: fromAttrs.itemIndex,
    itemIndexAtSelectionEnd: toAttrs.itemIndex,
    indentLevelAtSelectionStart: fromAttrs.indentLevel,
    indentLevelAtSelectionEnd: toAttrs.indentLevel,
    itemsInSelection: countListItemsInSelection(state)
  };
};

exports.getCommonListAnalyticsAttributes = getCommonListAnalyticsAttributes;

var countListItemsInSelection = function countListItemsInSelection(state) {
  var _state$selection2 = state.selection,
      from = _state$selection2.from,
      to = _state$selection2.to;

  if (from === to) {
    return 1;
  }

  var count = 0;
  var listSlice = state.doc.cut(from, to);
  listSlice.content.nodesBetween(0, listSlice.content.size, function (node, pos, parent, index) {
    if (parent && (0, _node.isListItemNode)(parent) && !(0, _node.isListNode)(node) && index === 0) {
      count++;
    }
  });
  return count;
};

exports.countListItemsInSelection = countListItemsInSelection;