import { liftTarget } from 'prosemirror-transform';
import { findParentNodeClosestToPos, hasParentNodeOfType } from 'prosemirror-utils';
import { findFarthestParentNode } from '../../../utils';
export const isInsideTaskOrDecisionItem = state => {
  const {
    decisionItem,
    taskItem
  } = state.schema.nodes;
  return hasParentNodeOfType([decisionItem, taskItem])(state.selection);
};
export const isActionOrDecisionList = node => {
  const {
    taskList,
    decisionList
  } = node.type.schema.nodes;
  return [taskList, decisionList].indexOf(node.type) > -1;
};
export const isActionOrDecisionItem = node => {
  const {
    taskItem,
    decisionItem
  } = node.type.schema.nodes;
  return [taskItem, decisionItem].indexOf(node.type) > -1;
};
export const isInsideTask = state => {
  const {
    taskItem
  } = state.schema.nodes;
  return hasParentNodeOfType([taskItem])(state.selection);
};
export const isInsideDecision = state => {
  const {
    decisionItem
  } = state.schema.nodes;
  return hasParentNodeOfType([decisionItem])(state.selection);
};
export const isTable = node => {
  if (!node) {
    return false;
  }

  const {
    table,
    tableHeader,
    tableCell,
    tableRow
  } = node.type.schema.nodes;
  return [table, tableHeader, tableCell, tableRow].includes(node.type);
};
/**
 * Creates a NodeRange around the given taskItem and the following
 * ("nested") taskList, if one exists.
 */

export const getBlockRange = ($from, $to) => {
  const {
    taskList
  } = $from.doc.type.schema.nodes;
  let end = $to.end();
  const $after = $to.doc.resolve(end + 1);
  const after = $after.nodeAfter; // ensure the node after is actually just a sibling
  // $to will be inside the text, so subtract one to get the taskItem it contains in

  if (after && after.type === taskList && $after.depth === $to.depth - 1) {
    // it was! include it in our blockRange
    end += after.nodeSize;
  }

  return $from.blockRange($to.doc.resolve(end));
};
/**
 * Finds the distance between the current $from and the root of the taskList.
 */

export const getCurrentIndentLevel = selection => {
  const {
    $from
  } = selection;
  const {
    taskList
  } = $from.doc.type.schema.nodes;
  const furthestParent = findFarthestParentNode(node => node.type === taskList)($from);

  if (!furthestParent) {
    return null;
  }

  return $from.depth - furthestParent.depth;
};
/**
 * Finds the index of the current task item in relation to the closest taskList
 */

export const getTaskItemIndex = state => {
  const $pos = state.selection.$from;

  const isTaskList = node => (node === null || node === void 0 ? void 0 : node.type.name) === 'taskList';

  const itemAtPos = findParentNodeClosestToPos($pos, isTaskList);
  return $pos.index(itemAtPos ? itemAtPos.depth : undefined);
};
/**
 * Walk outwards from a position until we encounter the (inside) start of
 * the next node, or reach the end of the document.
 *
 * @param $startPos Position to start walking from.
 */

export const walkOut = $startPos => {
  let $pos = $startPos; // invariant 1: don't walk past the end of the document
  // invariant 2: we haven't walked to the start of *any* node
  //              parentOffset includes textOffset.

  while ($pos.pos < $pos.doc.nodeSize - 2 && $pos.parentOffset > 0) {
    $pos = $pos.doc.resolve($pos.pos + 1);
  }

  return $pos;
};
/**
 * Finds the height of a tree-like structure, given any position inside it.
 *
 * Traverses from the top of the tree to all leaf nodes, and returns the length
 * of the longest path.
 *
 * This means you can use it with things like taskList, which
 * do not nest themselves inside taskItems but rather as adjacent children.
 *
 * @param $pos Any position inside the tree.
 * @param types The node types to consider traversable
 */

export const subtreeHeight = ($from, $to, types) => {
  const root = findFarthestParentNode(node => types.indexOf(node.type) > -1)($from);

  if (!root) {
    return -1;
  } // get the height between the root and the current position


  const distToParent = $from.depth - root.depth; // include any following taskList since nested lists appear
  // as siblings
  //
  // this is unlike regular bullet lists where the orderedList
  // appears as descendent of listItem

  const blockRange = getBlockRange($from, $to);

  if (!blockRange) {
    return -1;
  } // and get the max height from the current position to the
  // deepest leaf node


  let maxChildDepth = $from.depth;
  $from.doc.nodesBetween(blockRange.start, blockRange.end, (descendent, relPos, parent) => {
    maxChildDepth = Math.max($from.doc.resolve(relPos).depth, maxChildDepth); // keep descending down the tree if we can

    if (types.indexOf(descendent.type) > -1) {
      return true;
    }
  });
  return distToParent + (maxChildDepth - $from.depth);
};
/**
 * Returns `true` if the taskItem or decisionItem has no text.
 */

export const isEmptyTaskDecision = state => {
  const {
    selection,
    schema
  } = state;
  const {
    $from
  } = selection;
  const node = $from.node($from.depth);
  return node && (node.type === schema.nodes.taskItem || node.type === schema.nodes.decisionItem) && node.content.size === 0;
};
/**
 * Lifts a taskItem and any directly following taskList
 * (taskItem and its "nested children") out one level.
 *
 * @param tr Transaction to base steps on
 * @param $from Start of range you want to lift
 * @param $to End of range you want to lift (can be same as `$from`)
 */

export const liftBlock = (tr, $from, $to) => {
  const blockRange = getBlockRange($from, $to);

  if (!blockRange) {
    return null;
  } // ensure we can actually lift


  const target = liftTarget(blockRange);

  if (typeof target !== 'number') {
    return null;
  }

  return tr.lift(blockRange, target).scrollIntoView();
};