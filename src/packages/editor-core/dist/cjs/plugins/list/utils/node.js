"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JoinDirection = void 0;
exports.isBulletList = isBulletList;
exports.isDocumentNode = isDocumentNode;
exports.isListItemNode = isListItemNode;
exports.isListNode = isListNode;
exports.isListNodeValidContent = isListNodeValidContent;
exports.isParagraphNode = isParagraphNode;
exports.joinSiblingLists = void 0;

var _prosemirrorModel = require("prosemirror-model");

function isDocumentNode(node) {
  return Boolean(node && node.type && node.type.name === 'doc');
}

function isListNode(node) {
  return Boolean(node && node.type && ['orderedList', 'bulletList'].includes(node.type.name));
}

function isParagraphNode(node) {
  return Boolean(node && node.type && 'paragraph' === node.type.name);
}

function isListItemNode(node) {
  return Boolean(node && node.type && 'listItem' === node.type.name);
}

function isBulletList(node) {
  return Boolean(node && node.type && 'bulletList' === node.type.name);
}

function isListNodeValidContent(node) {
  var bulletList = node.type.schema.nodes.bulletList;

  if (!bulletList) {
    return false;
  }

  var listFragment = _prosemirrorModel.Fragment.from(bulletList.createAndFill());

  return !isListItemNode(node) && node.type.validContent(listFragment);
}

var JoinDirection;
exports.JoinDirection = JoinDirection;

(function (JoinDirection) {
  JoinDirection[JoinDirection["LEFT"] = 1] = "LEFT";
  JoinDirection[JoinDirection["RIGHT"] = -1] = "RIGHT";
})(JoinDirection || (exports.JoinDirection = JoinDirection = {}));

var joinSiblingLists = function joinSiblingLists(_ref) {
  var tr = _ref.tr,
      direction = _ref.direction,
      forceListType = _ref.forceListType;
  var result = {
    orderedList: 0,
    bulletList: 0
  };
  var doc = tr.doc,
      _tr$selection = tr.selection,
      $from = _tr$selection.$from,
      $to = _tr$selection.$to,
      selection = tr.selection;
  var range = $from.blockRange($to, isListNodeValidContent);

  if (!range) {
    return result;
  }

  var rootListNode = doc.nodeAt(range.start);
  var from = isListNode(rootListNode) ? range.start : 0;
  var to = isListNode(rootListNode) ? range.end : tr.doc.content.size;
  var joins = [];
  doc.nodesBetween(from, to, function (node, pos, parent) {
    var resolvedPos = doc.resolve(pos);
    var nodeBefore = resolvedPos.nodeBefore,
        nodeAfter = resolvedPos.nodeAfter;

    if (!nodeBefore || !nodeAfter || !isListNode(nodeBefore) || !isListNode(nodeAfter)) {
      return;
    }

    var isNestedList = isListItemNode(parent);

    if (!isNestedList && nodeBefore.type !== nodeAfter.type && !forceListType) {
      return;
    }

    var index = resolvedPos.index();
    var positionPreviousNode = resolvedPos.posAtIndex(index - 1);
    var positionCurrentNode = resolvedPos.posAtIndex(index); // If the previous node is part of the selection, OR
    // If the previous node is not part of the selection and the previous node has the same list type that we’re converting to

    var joinBefore = positionPreviousNode >= from || nodeBefore.type === forceListType;

    if (forceListType) {
      if (joinBefore) {
        tr.setNodeMarkup(positionPreviousNode, forceListType);
      }

      tr.setNodeMarkup(positionCurrentNode, forceListType);
    }

    if (isNestedList && nodeBefore.type !== nodeAfter.type) {
      var nodeType = direction === JoinDirection.RIGHT ? nodeAfter.type : nodeBefore.type;
      tr.setNodeMarkup(positionPreviousNode, nodeType);
    }

    if (joinBefore) {
      joins.push(pos);
    }
  });

  if (selection.empty && rootListNode && isListNode(rootListNode)) {
    var resolvedPos = doc.resolve(range.start + rootListNode.nodeSize);
    var nodeBefore = resolvedPos.nodeBefore,
        nodeAfter = resolvedPos.nodeAfter;

    if (nodeBefore && nodeAfter && isListNode(nodeBefore) && isListNode(nodeAfter) && nodeAfter.type === nodeBefore.type) {
      joins.push(resolvedPos.pos);
    }
  }

  for (var i = joins.length - 1; i >= 0; i--) {
    var listNode = tr.doc.nodeAt(joins[i]);
    var listName = listNode === null || listNode === void 0 ? void 0 : listNode.type.name;

    if (listName && (listName === 'orderedList' || listName === 'bulletList')) {
      var amount = result[listName] || 0;
      result[listName] = amount + 1;
    }

    tr.join(joins[i]);
  }

  return result;
};

exports.joinSiblingLists = joinSiblingLists;