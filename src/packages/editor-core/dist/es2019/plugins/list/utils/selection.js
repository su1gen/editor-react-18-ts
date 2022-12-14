import { findWrapping } from 'prosemirror-transform';
import { Selection, TextSelection, NodeSelection } from 'prosemirror-state';
import { findParentNodeClosestToPos, findParentNodeOfType, hasParentNodeOfType } from 'prosemirror-utils';
import { GapCursorSelection } from '../../selection/gap-cursor-selection';
import { isListItemNode, isListNode, isParagraphNode } from './node';
export const isPosInsideParagraph = $pos => {
  return $pos.parent.type.name === 'paragraph';
};
export const isPosInsideList = $pos => {
  const posGrandParent = $pos.node(-1);
  return isListItemNode($pos.parent) || isListNode($pos.parent) || isListItemNode(posGrandParent);
};
export const isWrappingPossible = (nodeType, selection) => {
  const {
    $from,
    $to
  } = selection;
  let range;

  if (selection instanceof GapCursorSelection && $from.nodeAfter) {
    const nodeSize = $from.nodeAfter.nodeSize || 1;
    range = $from.blockRange($from.doc.resolve($from.pos + nodeSize));
  } else {
    range = $from.blockRange($to);
  }

  if (!range) {
    return false;
  }

  const wrap = findWrapping(range, nodeType);

  if (!wrap) {
    return false;
  }

  return true;
}; // canOutdent

export const isInsideListItem = state => {
  const {
    parent
  } = state.selection.$from;
  const {
    listItem
  } = state.schema.nodes;

  if (state.selection instanceof GapCursorSelection) {
    return isListItemNode(parent);
  }

  return hasParentNodeOfType(listItem)(state.selection) && isParagraphNode(parent);
};
export const isInsideTableCell = state => {
  const {
    tableCell,
    tableHeader
  } = state.schema.nodes;
  return !!findParentNodeOfType([tableCell, tableHeader])(state.selection);
};
export const canJoinToPreviousListItem = state => {
  const {
    $from
  } = state.selection;
  const $before = state.doc.resolve($from.pos - 1);
  let nodeBefore = $before ? $before.nodeBefore : null;

  if (state.selection instanceof GapCursorSelection) {
    nodeBefore = $from.nodeBefore;
  }

  return isListNode(nodeBefore);
};
export const selectionContainsList = tr => {
  const {
    selection: {
      from,
      to
    }
  } = tr;
  let foundListNode = null;
  tr.doc.nodesBetween(from, to, node => {
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
export const numberNestedLists = resolvedPos => {
  let count = 0;

  for (let i = resolvedPos.depth - 1; i > 0; i--) {
    const node = resolvedPos.node(i);

    if (isListNode(node)) {
      count += 1;
    }
  }

  return count;
};
export const getListItemAttributes = $pos => {
  const indentLevel = numberNestedLists($pos) - 1;
  const itemAtPos = findParentNodeClosestToPos($pos, isListItemNode); // Get the index of the current item relative to parent (parent is at item depth - 1)

  const itemIndex = $pos.index(itemAtPos ? itemAtPos.depth - 1 : undefined);
  return {
    indentLevel,
    itemIndex
  };
};
export const normalizeListItemsSelection = ({
  selection,
  doc
}) => {
  if (selection.empty) {
    return selection;
  }

  const {
    $from,
    $to
  } = selection;

  if (selection instanceof NodeSelection) {
    const head = resolvePositionToStartOfListItem($from);
    return new TextSelection(head, head);
  }

  const head = resolvePositionToStartOfListItem($from);
  const anchor = resolvePositionToEndOfListItem($to);
  return new TextSelection(anchor, head);
};
export const resolvePositionToStartOfListItem = $pos => {
  const fromRange = $pos.blockRange($pos, isListItemNode);
  const fromPosition = fromRange && $pos.textOffset === 0 && fromRange.end - 1 === $pos.pos ? Selection.near($pos.doc.resolve(fromRange.end + 1), 1).$from : $pos;
  return fromPosition;
};
export const resolvePositionToEndOfListItem = $pos => {
  const toRange = $pos.blockRange($pos, isListItemNode);
  const toPosition = toRange && $pos.textOffset === 0 && toRange.start + 1 === $pos.pos ? Selection.near($pos.doc.resolve(toRange.start - 1), -1).$to : $pos;
  return toPosition;
};
export const createListNodeRange = ({
  selection
}) => {
  const {
    $from,
    $to
  } = selection;
  const range = $from.blockRange($to, isListNode);

  if (!range) {
    return null;
  }

  return range;
};
export const createListItemNodeRange = ({
  selection
}) => {
  const {
    $from,
    $to
  } = selection;
  const range = $from.blockRange($to, isListItemNode);

  if (!range) {
    return null;
  }

  return range;
};