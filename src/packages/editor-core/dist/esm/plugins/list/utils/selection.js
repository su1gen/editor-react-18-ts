import { findWrapping } from 'prosemirror-transform';
import { Selection, TextSelection, NodeSelection } from 'prosemirror-state';
import { findParentNodeClosestToPos, findParentNodeOfType, hasParentNodeOfType } from 'prosemirror-utils';
import { GapCursorSelection } from '../../selection/gap-cursor-selection';
import { isListItemNode, isListNode, isParagraphNode } from './node';
export var isPosInsideParagraph = function isPosInsideParagraph($pos) {
  return $pos.parent.type.name === 'paragraph';
};
export var isPosInsideList = function isPosInsideList($pos) {
  var posGrandParent = $pos.node(-1);
  return isListItemNode($pos.parent) || isListNode($pos.parent) || isListItemNode(posGrandParent);
};
export var isWrappingPossible = function isWrappingPossible(nodeType, selection) {
  var $from = selection.$from,
      $to = selection.$to;
  var range;

  if (selection instanceof GapCursorSelection && $from.nodeAfter) {
    var nodeSize = $from.nodeAfter.nodeSize || 1;
    range = $from.blockRange($from.doc.resolve($from.pos + nodeSize));
  } else {
    range = $from.blockRange($to);
  }

  if (!range) {
    return false;
  }

  var wrap = findWrapping(range, nodeType);

  if (!wrap) {
    return false;
  }

  return true;
}; // canOutdent

export var isInsideListItem = function isInsideListItem(state) {
  var parent = state.selection.$from.parent;
  var listItem = state.schema.nodes.listItem;

  if (state.selection instanceof GapCursorSelection) {
    return isListItemNode(parent);
  }

  return hasParentNodeOfType(listItem)(state.selection) && isParagraphNode(parent);
};
export var isInsideTableCell = function isInsideTableCell(state) {
  var _state$schema$nodes = state.schema.nodes,
      tableCell = _state$schema$nodes.tableCell,
      tableHeader = _state$schema$nodes.tableHeader;
  return !!findParentNodeOfType([tableCell, tableHeader])(state.selection);
};
export var canJoinToPreviousListItem = function canJoinToPreviousListItem(state) {
  var $from = state.selection.$from;
  var $before = state.doc.resolve($from.pos - 1);
  var nodeBefore = $before ? $before.nodeBefore : null;

  if (state.selection instanceof GapCursorSelection) {
    nodeBefore = $from.nodeBefore;
  }

  return isListNode(nodeBefore);
};
export var selectionContainsList = function selectionContainsList(tr) {
  var _tr$selection = tr.selection,
      from = _tr$selection.from,
      to = _tr$selection.to;
  var foundListNode = null;
  tr.doc.nodesBetween(from, to, function (node) {
    if (isListNode(node)) {
      foundListNode = node;
    }

    if (foundListNode) {
      return false;
    }

    return true;
  });
  return foundListNode;
};
export var numberNestedLists = function numberNestedLists(resolvedPos) {
  var count = 0;

  for (var i = resolvedPos.depth - 1; i > 0; i--) {
    var node = resolvedPos.node(i);

    if (isListNode(node)) {
      count += 1;
    }
  }

  return count;
};
export var getListItemAttributes = function getListItemAttributes($pos) {
  var indentLevel = numberNestedLists($pos) - 1;
  var itemAtPos = findParentNodeClosestToPos($pos, isListItemNode); // Get the index of the current item relative to parent (parent is at item depth - 1)

  var itemIndex = $pos.index(itemAtPos ? itemAtPos.depth - 1 : undefined);
  return {
    indentLevel: indentLevel,
    itemIndex: itemIndex
  };
};
export var normalizeListItemsSelection = function normalizeListItemsSelection(_ref) {
  var selection = _ref.selection,
      doc = _ref.doc;

  if (selection.empty) {
    return selection;
  }

  var $from = selection.$from,
      $to = selection.$to;

  if (selection instanceof NodeSelection) {
    var _head = resolvePositionToStartOfListItem($from);

    return new TextSelection(_head, _head);
  }

  var head = resolvePositionToStartOfListItem($from);
  var anchor = resolvePositionToEndOfListItem($to);
  return new TextSelection(anchor, head);
};
export var resolvePositionToStartOfListItem = function resolvePositionToStartOfListItem($pos) {
  var fromRange = $pos.blockRange($pos, isListItemNode);
  var fromPosition = fromRange && $pos.textOffset === 0 && fromRange.end - 1 === $pos.pos ? Selection.near($pos.doc.resolve(fromRange.end + 1), 1).$from : $pos;
  return fromPosition;
};
export var resolvePositionToEndOfListItem = function resolvePositionToEndOfListItem($pos) {
  var toRange = $pos.blockRange($pos, isListItemNode);
  var toPosition = toRange && $pos.textOffset === 0 && toRange.start + 1 === $pos.pos ? Selection.near($pos.doc.resolve(toRange.start - 1), -1).$to : $pos;
  return toPosition;
};
export var createListNodeRange = function createListNodeRange(_ref2) {
  var selection = _ref2.selection;
  var $from = selection.$from,
      $to = selection.$to;
  var range = $from.blockRange($to, isListNode);

  if (!range) {
    return null;
  }

  return range;
};
export var createListItemNodeRange = function createListItemNodeRange(_ref3) {
  var selection = _ref3.selection;
  var $from = selection.$from,
      $to = selection.$to;
  var range = $from.blockRange($to, isListItemNode);

  if (!range) {
    return null;
  }

  return range;
};