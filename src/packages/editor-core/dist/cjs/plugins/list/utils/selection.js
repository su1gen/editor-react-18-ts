"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectionContainsList = exports.resolvePositionToStartOfListItem = exports.resolvePositionToEndOfListItem = exports.numberNestedLists = exports.normalizeListItemsSelection = exports.isWrappingPossible = exports.isPosInsideParagraph = exports.isPosInsideList = exports.isInsideTableCell = exports.isInsideListItem = exports.getListItemAttributes = exports.createListNodeRange = exports.createListItemNodeRange = exports.canJoinToPreviousListItem = void 0;

var _prosemirrorTransform = require("prosemirror-transform");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorUtils = require("prosemirror-utils");

var _gapCursorSelection = require("../../selection/gap-cursor-selection");

var _node = require("./node");

var isPosInsideParagraph = function isPosInsideParagraph($pos) {
  return $pos.parent.type.name === 'paragraph';
};

exports.isPosInsideParagraph = isPosInsideParagraph;

var isPosInsideList = function isPosInsideList($pos) {
  var posGrandParent = $pos.node(-1);
  return (0, _node.isListItemNode)($pos.parent) || (0, _node.isListNode)($pos.parent) || (0, _node.isListItemNode)(posGrandParent);
};

exports.isPosInsideList = isPosInsideList;

var isWrappingPossible = function isWrappingPossible(nodeType, selection) {
  var $from = selection.$from,
      $to = selection.$to;
  var range;

  if (selection instanceof _gapCursorSelection.GapCursorSelection && $from.nodeAfter) {
    var nodeSize = $from.nodeAfter.nodeSize || 1;
    range = $from.blockRange($from.doc.resolve($from.pos + nodeSize));
  } else {
    range = $from.blockRange($to);
  }

  if (!range) {
    return false;
  }

  var wrap = (0, _prosemirrorTransform.findWrapping)(range, nodeType);

  if (!wrap) {
    return false;
  }

  return true;
}; // canOutdent


exports.isWrappingPossible = isWrappingPossible;

var isInsideListItem = function isInsideListItem(state) {
  var parent = state.selection.$from.parent;
  var listItem = state.schema.nodes.listItem;

  if (state.selection instanceof _gapCursorSelection.GapCursorSelection) {
    return (0, _node.isListItemNode)(parent);
  }

  return (0, _prosemirrorUtils.hasParentNodeOfType)(listItem)(state.selection) && (0, _node.isParagraphNode)(parent);
};

exports.isInsideListItem = isInsideListItem;

var isInsideTableCell = function isInsideTableCell(state) {
  var _state$schema$nodes = state.schema.nodes,
      tableCell = _state$schema$nodes.tableCell,
      tableHeader = _state$schema$nodes.tableHeader;
  return !!(0, _prosemirrorUtils.findParentNodeOfType)([tableCell, tableHeader])(state.selection);
};

exports.isInsideTableCell = isInsideTableCell;

var canJoinToPreviousListItem = function canJoinToPreviousListItem(state) {
  var $from = state.selection.$from;
  var $before = state.doc.resolve($from.pos - 1);
  var nodeBefore = $before ? $before.nodeBefore : null;

  if (state.selection instanceof _gapCursorSelection.GapCursorSelection) {
    nodeBefore = $from.nodeBefore;
  }

  return (0, _node.isListNode)(nodeBefore);
};

exports.canJoinToPreviousListItem = canJoinToPreviousListItem;

var selectionContainsList = function selectionContainsList(tr) {
  var _tr$selection = tr.selection,
      from = _tr$selection.from,
      to = _tr$selection.to;
  var foundListNode = null;
  tr.doc.nodesBetween(from, to, function (node) {
    if ((0, _node.isListNode)(node)) {
      foundListNode = node;
    }

    if (foundListNode) {
      return false;
    }

    return true;
  });
  return foundListNode;
};

exports.selectionContainsList = selectionContainsList;

var numberNestedLists = function numberNestedLists(resolvedPos) {
  var count = 0;

  for (var i = resolvedPos.depth - 1; i > 0; i--) {
    var node = resolvedPos.node(i);

    if ((0, _node.isListNode)(node)) {
      count += 1;
    }
  }

  return count;
};

exports.numberNestedLists = numberNestedLists;

var getListItemAttributes = function getListItemAttributes($pos) {
  var indentLevel = numberNestedLists($pos) - 1;
  var itemAtPos = (0, _prosemirrorUtils.findParentNodeClosestToPos)($pos, _node.isListItemNode); // Get the index of the current item relative to parent (parent is at item depth - 1)

  var itemIndex = $pos.index(itemAtPos ? itemAtPos.depth - 1 : undefined);
  return {
    indentLevel: indentLevel,
    itemIndex: itemIndex
  };
};

exports.getListItemAttributes = getListItemAttributes;

var normalizeListItemsSelection = function normalizeListItemsSelection(_ref) {
  var selection = _ref.selection,
      doc = _ref.doc;

  if (selection.empty) {
    return selection;
  }

  var $from = selection.$from,
      $to = selection.$to;

  if (selection instanceof _prosemirrorState.NodeSelection) {
    var _head = resolvePositionToStartOfListItem($from);

    return new _prosemirrorState.TextSelection(_head, _head);
  }

  var head = resolvePositionToStartOfListItem($from);
  var anchor = resolvePositionToEndOfListItem($to);
  return new _prosemirrorState.TextSelection(anchor, head);
};

exports.normalizeListItemsSelection = normalizeListItemsSelection;

var resolvePositionToStartOfListItem = function resolvePositionToStartOfListItem($pos) {
  var fromRange = $pos.blockRange($pos, _node.isListItemNode);
  var fromPosition = fromRange && $pos.textOffset === 0 && fromRange.end - 1 === $pos.pos ? _prosemirrorState.Selection.near($pos.doc.resolve(fromRange.end + 1), 1).$from : $pos;
  return fromPosition;
};

exports.resolvePositionToStartOfListItem = resolvePositionToStartOfListItem;

var resolvePositionToEndOfListItem = function resolvePositionToEndOfListItem($pos) {
  var toRange = $pos.blockRange($pos, _node.isListItemNode);
  var toPosition = toRange && $pos.textOffset === 0 && toRange.start + 1 === $pos.pos ? _prosemirrorState.Selection.near($pos.doc.resolve(toRange.start - 1), -1).$to : $pos;
  return toPosition;
};

exports.resolvePositionToEndOfListItem = resolvePositionToEndOfListItem;

var createListNodeRange = function createListNodeRange(_ref2) {
  var selection = _ref2.selection;
  var $from = selection.$from,
      $to = selection.$to;
  var range = $from.blockRange($to, _node.isListNode);

  if (!range) {
    return null;
  }

  return range;
};

exports.createListNodeRange = createListNodeRange;

var createListItemNodeRange = function createListItemNodeRange(_ref3) {
  var selection = _ref3.selection;
  var $from = selection.$from,
      $to = selection.$to;
  var range = $from.blockRange($to, _node.isListItemNode);

  if (!range) {
    return null;
  }

  return range;
};

exports.createListItemNodeRange = createListItemNodeRange;