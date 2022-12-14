import { liftTarget } from 'prosemirror-transform';
import { findParentNodeClosestToPos, hasParentNodeOfType } from 'prosemirror-utils';
import { findFarthestParentNode } from '../../../utils';
export var isInsideTaskOrDecisionItem = function isInsideTaskOrDecisionItem(state) {
  var _state$schema$nodes = state.schema.nodes,
      decisionItem = _state$schema$nodes.decisionItem,
      taskItem = _state$schema$nodes.taskItem;
  return hasParentNodeOfType([decisionItem, taskItem])(state.selection);
};
export var isActionOrDecisionList = function isActionOrDecisionList(node) {
  var _node$type$schema$nod = node.type.schema.nodes,
      taskList = _node$type$schema$nod.taskList,
      decisionList = _node$type$schema$nod.decisionList;
  return [taskList, decisionList].indexOf(node.type) > -1;
};
export var isActionOrDecisionItem = function isActionOrDecisionItem(node) {
  var _node$type$schema$nod2 = node.type.schema.nodes,
      taskItem = _node$type$schema$nod2.taskItem,
      decisionItem = _node$type$schema$nod2.decisionItem;
  return [taskItem, decisionItem].indexOf(node.type) > -1;
};
export var isInsideTask = function isInsideTask(state) {
  var taskItem = state.schema.nodes.taskItem;
  return hasParentNodeOfType([taskItem])(state.selection);
};
export var isInsideDecision = function isInsideDecision(state) {
  var decisionItem = state.schema.nodes.decisionItem;
  return hasParentNodeOfType([decisionItem])(state.selection);
};
export var isTable = function isTable(node) {
  if (!node) {
    return false;
  }

  var _node$type$schema$nod3 = node.type.schema.nodes,
      table = _node$type$schema$nod3.table,
      tableHeader = _node$type$schema$nod3.tableHeader,
      tableCell = _node$type$schema$nod3.tableCell,
      tableRow = _node$type$schema$nod3.tableRow;
  return [table, tableHeader, tableCell, tableRow].includes(node.type);
};
/**
 * Creates a NodeRange around the given taskItem and the following
 * ("nested") taskList, if one exists.
 */

export var getBlockRange = function getBlockRange($from, $to) {
  var taskList = $from.doc.type.schema.nodes.taskList;
  var end = $to.end();
  var $after = $to.doc.resolve(end + 1);
  var after = $after.nodeAfter; // ensure the node after is actually just a sibling
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

export var getCurrentIndentLevel = function getCurrentIndentLevel(selection) {
  var $from = selection.$from;
  var taskList = $from.doc.type.schema.nodes.taskList;
  var furthestParent = findFarthestParentNode(function (node) {
    return node.type === taskList;
  })($from);

  if (!furthestParent) {
    return null;
  }

  return $from.depth - furthestParent.depth;
};
/**
 * Finds the index of the current task item in relation to the closest taskList
 */

export var getTaskItemIndex = function getTaskItemIndex(state) {
  var $pos = state.selection.$from;

  var isTaskList = function isTaskList(node) {
    return (node === null || node === void 0 ? void 0 : node.type.name) === 'taskList';
  };

  var itemAtPos = findParentNodeClosestToPos($pos, isTaskList);
  return $pos.index(itemAtPos ? itemAtPos.depth : undefined);
};
/**
 * Walk outwards from a position until we encounter the (inside) start of
 * the next node, or reach the end of the document.
 *
 * @param $startPos Position to start walking from.
 */

export var walkOut = function walkOut($startPos) {
  var $pos = $startPos; // invariant 1: don't walk past the end of the document
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

export var subtreeHeight = function subtreeHeight($from, $to, types) {
  var root = findFarthestParentNode(function (node) {
    return types.indexOf(node.type) > -1;
  })($from);

  if (!root) {
    return -1;
  } // get the height between the root and the current position


  var distToParent = $from.depth - root.depth; // include any following taskList since nested lists appear
  // as siblings
  //
  // this is unlike regular bullet lists where the orderedList
  // appears as descendent of listItem

  var blockRange = getBlockRange($from, $to);

  if (!blockRange) {
    return -1;
  } // and get the max height from the current position to the
  // deepest leaf node


  var maxChildDepth = $from.depth;
  $from.doc.nodesBetween(blockRange.start, blockRange.end, function (descendent, relPos, parent) {
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

export var isEmptyTaskDecision = function isEmptyTaskDecision(state) {
  var selection = state.selection,
      schema = state.schema;
  var $from = selection.$from;
  var node = $from.node($from.depth);
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

export var liftBlock = function liftBlock(tr, $from, $to) {
  var blockRange = getBlockRange($from, $to);

  if (!blockRange) {
    return null;
  } // ensure we can actually lift


  var target = liftTarget(blockRange);

  if (typeof target !== 'number') {
    return null;
  }

  return tr.lift(blockRange, target).scrollIntoView();
};