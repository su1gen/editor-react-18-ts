"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insertSliceForLists = insertSliceForLists;

var _prosemirrorUtils = require("prosemirror-utils");

var _lists = require("./lists");

var _node = require("../../list/utils/node");

var _util = require("../util");

function insertSliceForLists(_ref) {
  var _slice$content$firstC;

  var tr = _ref.tr,
      slice = _ref.slice,
      schema = _ref.schema;
  var selection = tr.selection,
      _tr$selection = tr.selection,
      $to = _tr$selection.$to,
      $from = _tr$selection.$from;
  var _ref2 = selection,
      $cursor = _ref2.$cursor;
  var panelNode = (0, _util.isSelectionInsidePanel)(selection);
  var selectionIsInsideList = $from.blockRange($to, _node.isListNode);

  if (!$cursor && selectionIsInsideList) {
    return (0, _lists.insertSliceIntoRangeSelectionInsideList)({
      tr: tr,
      slice: slice
    });
  } // if inside an empty panel, try and insert content inside it rather than replace it


  if (panelNode && (0, _util.isEmptyNode)(panelNode) && $from.node() === $to.node()) {
    return (0, _lists.insertSliceInsideOfPanelNodeSelected)(panelNode)({
      tr: tr,
      slice: slice
    });
  }

  if (!$cursor || selectionIsInsideList) {
    return tr.replaceSelection(slice);
  }

  if ((0, _util.isEmptyNode)(tr.doc.resolve($cursor.pos).node())) {
    return (0, _lists.insertSliceIntoEmptyNode)({
      tr: tr,
      slice: slice
    });
  } // When pasting a single list item into an action or decision, we skip the special "insert at node edge"
  // logic so that prosemirror pastes the list's content into the action/decision, rather than
  // pasting a whole list node directly after the action/decision item. (But we still preserve the
  // existing "insert at" node edge" behaviour if dealing with a list with more than one item, so that
  // it still inserts whole list node after the action/decision item).


  var pastingIntoActionOrDecision = Boolean((0, _prosemirrorUtils.findParentNodeOfType)([schema.nodes.taskList, schema.nodes.decisionList])(selection));
  var oneListItem = slice.content.childCount === 1 && (0, _node.isListNode)(slice.content.firstChild) && ((_slice$content$firstC = slice.content.firstChild) === null || _slice$content$firstC === void 0 ? void 0 : _slice$content$firstC.childCount) === 1;

  if (!(pastingIntoActionOrDecision && oneListItem) && (0, _util.isCursorSelectionAtTextStartOrEnd)(selection)) {
    return (0, _lists.insertSliceAtNodeEdge)({
      tr: tr,
      slice: slice
    });
  }

  tr.replaceSelection(slice);
}