"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hasValidListIndentationLevel = exports.getNextSiblingListItemPosition = exports.getListLiftTarget = void 0;

var _selection = require("./selection");

var _node = require("./node");

// This will return (depth - 1) for root list parent of a list.
var getListLiftTarget = function getListLiftTarget(resPos) {
  var target = resPos.depth;

  for (var i = resPos.depth; i > 0; i--) {
    var node = resPos.node(i);

    if ((0, _node.isListNode)(node)) {
      target = i;
    }

    if (!(0, _node.isListItemNode)(node) && !(0, _node.isListNode)(node)) {
      break;
    }
  }

  return target - 1;
};

exports.getListLiftTarget = getListLiftTarget;

var getNextSiblingListItemPosition = function getNextSiblingListItemPosition($pos) {
  var _$pos$doc$nodeAt;

  var target = $pos.depth;
  var found = false;

  for (var i = $pos.depth; i > 0; i--) {
    var node = $pos.node(i);

    if ((0, _node.isListItemNode)(node)) {
      target = i;
      found = true;
    }

    if (found) {
      break;
    }
  }

  var listItemPosition = target - 1;
  var listItemNodePosition = ((_$pos$doc$nodeAt = $pos.doc.nodeAt(listItemPosition)) === null || _$pos$doc$nodeAt === void 0 ? void 0 : _$pos$doc$nodeAt.nodeSize) || 0;
  var nextListItemPosition = listItemPosition + listItemNodePosition;
  var nextListItemNode = $pos.doc.nodeAt(nextListItemPosition);

  if (nextListItemNode) {
    return $pos.doc.resolve(nextListItemPosition);
  }

  return null;
};

exports.getNextSiblingListItemPosition = getNextSiblingListItemPosition;

var hasValidListIndentationLevel = function hasValidListIndentationLevel(_ref) {
  var tr = _ref.tr,
      maxIndentation = _ref.maxIndentation;
  var initialIndentationLevel = (0, _selection.numberNestedLists)(tr.selection.$from);
  var currentIndentationLevel;
  var currentPos = tr.selection.$to.pos;

  do {
    var resolvedPos = tr.doc.resolve(currentPos);
    currentIndentationLevel = (0, _selection.numberNestedLists)(resolvedPos);

    if (currentIndentationLevel > maxIndentation) {
      return false;
    }

    currentPos++;
  } while (currentIndentationLevel >= initialIndentationLevel);

  return true;
};

exports.hasValidListIndentationLevel = hasValidListIndentationLevel;