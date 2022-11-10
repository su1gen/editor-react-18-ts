import { findParentNodeClosestToPos } from 'prosemirror-utils';
import { isListNode, isListItemNode } from './node';
export function findFirstNestedList($pos) {
  var currentNode = $pos.doc.nodeAt($pos.pos);
  var currentListItemPos = null;

  if (isListItemNode(currentNode)) {
    currentListItemPos = $pos.pos;
  } else {
    var result = findParentNodeClosestToPos($pos, isListItemNode);
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

  if (!isListNode(lastListItemChild)) {
    return null;
  }

  var firstNestedListPosition = currentListItemNode.nodeSize - lastListItemChild.nodeSize;
  var firstNestedListNode = $pos.doc.nodeAt(firstNestedListPosition);

  if (!isListNode(firstNestedListNode)) {
    return null;
  }

  return $pos.doc.resolve(firstNestedListPosition);
}
export function findFirstParentListNode($pos) {
  var currentNode = $pos.doc.nodeAt($pos.pos);
  var listNodePosition = null;

  if (isListNode(currentNode)) {
    listNodePosition = $pos.pos;
  } else {
    var result = findParentNodeClosestToPos($pos, isListNode);
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
export function findFirstParentListItemNode($pos) {
  var currentNode = $pos.doc.nodeAt($pos.pos);
  var listItemNodePosition = isListItemNode(currentNode) ? $pos : findParentNodeClosestToPos($pos, isListItemNode);

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
export function findRootParentListNode($pos) {
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

  if (isListNode(currentNode) && !isListItemNode(nodeBefore)) {
    return doc.resolve($pos.pos + 1);
  }

  var parentList = findParentNodeClosestToPos($pos, isListNode);

  if (!parentList) {
    return null;
  }

  var listNodePosition = doc.resolve(parentList.pos);
  return findRootParentListNode(listNodePosition);
}