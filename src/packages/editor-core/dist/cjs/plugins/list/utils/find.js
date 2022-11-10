"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFirstNestedList = findFirstNestedList;
exports.findFirstParentListItemNode = findFirstParentListItemNode;
exports.findFirstParentListNode = findFirstParentListNode;
exports.findRootParentListNode = findRootParentListNode;

var _prosemirrorUtils = require("prosemirror-utils");

var _node = require("./node");

function findFirstNestedList($pos) {
  var currentNode = $pos.doc.nodeAt($pos.pos);
  var currentListItemPos = null;

  if ((0, _node.isListItemNode)(currentNode)) {
    currentListItemPos = $pos.pos;
  } else {
    var result = (0, _prosemirrorUtils.findParentNodeClosestToPos)($pos, _node.isListItemNode);
    currentListItemPos = (result === null || result === void 0 ? void 0 : result.pos) || null;
  }

  if (!currentListItemPos) {
    return null;
  }

  var currentListItemNode = $pos.doc.nodeAt(currentListItemPos);

  if (!currentListItemNode) {
    return null;
  }

  var lastListItemChild = currentListItemNode.child(currentListItemNode.childCount - 1);

  if (!(0, _node.isListNode)(lastListItemChild)) {
    return null;
  }

  var firstNestedListPosition = currentListItemNode.nodeSize - lastListItemChild.nodeSize;
  var firstNestedListNode = $pos.doc.nodeAt(firstNestedListPosition);

  if (!(0, _node.isListNode)(firstNestedListNode)) {
    return null;
  }

  return $pos.doc.resolve(firstNestedListPosition);
}

function findFirstParentListNode($pos) {
  var currentNode = $pos.doc.nodeAt($pos.pos);
  var listNodePosition = null;

  if ((0, _node.isListNode)(currentNode)) {
    listNodePosition = $pos.pos;
  } else {
    var result = (0, _prosemirrorUtils.findParentNodeClosestToPos)($pos, _node.isListNode);
    listNodePosition = result && result.pos;
  }

  if (listNodePosition == null) {
    return null;
  }

  var node = $pos.doc.nodeAt(listNodePosition);

  if (!node) {
    return null;
  }

  return {
    node: node,
    pos: listNodePosition
  };
}

function findFirstParentListItemNode($pos) {
  var currentNode = $pos.doc.nodeAt($pos.pos);
  var listItemNodePosition = (0, _node.isListItemNode)(currentNode) ? $pos : (0, _prosemirrorUtils.findParentNodeClosestToPos)($pos, _node.isListItemNode);

  if (!listItemNodePosition || listItemNodePosition.pos === null) {
    return null;
  }

  var node = $pos.doc.nodeAt(listItemNodePosition.pos);

  if (!node) {
    return null;
  }

  return {
    node: node,
    pos: listItemNodePosition.pos
  };
}

function findRootParentListNode($pos) {
  var doc = $pos.doc;

  if ($pos.pos + 1 > doc.content.size) {
    return null;
  }

  if ($pos.depth === 0) {
    return doc.resolve($pos.pos + 1);
  }

  var currentNode = doc.nodeAt($pos.pos);
  var beforePosition = $pos.before();
  var nodeBefore = doc.nodeAt(beforePosition);

  if ((0, _node.isListNode)(currentNode) && !(0, _node.isListItemNode)(nodeBefore)) {
    return doc.resolve($pos.pos + 1);
  }

  var parentList = (0, _prosemirrorUtils.findParentNodeClosestToPos)($pos, _node.isListNode);

  if (!parentList) {
    return null;
  }

  var listNodePosition = doc.resolve(parentList.pos);
  return findRootParentListNode(listNodePosition);
}