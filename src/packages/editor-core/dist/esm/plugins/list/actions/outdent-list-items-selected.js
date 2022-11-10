import { Selection, TextSelection, NodeSelection } from 'prosemirror-state';
import { NodeRange, Slice, Fragment } from 'prosemirror-model';
import { liftTarget, ReplaceAroundStep, ReplaceStep } from 'prosemirror-transform';
import { isListNode, isListItemNode, joinSiblingLists, JoinDirection } from '../utils/node';
import { findFirstParentListItemNode, findRootParentListNode } from '../utils/find';
import { normalizeListItemsSelection, createListNodeRange } from '../utils/selection';
import { GapCursorSelection } from '../../selection/gap-cursor-selection';
export var outdentListItemsSelected = function outdentListItemsSelected(tr) {
  var originalSelection = tr.selection;
  var normalizedSelection = normalizeListItemsSelection({
    selection: tr.selection,
    doc: tr.doc
  });
  var rootList = findRootParentListNode(normalizedSelection.$from);

  if (!rootList) {
    return;
  }

  var commonList = normalizedSelection.$from.blockRange(rootList, isListNode);

  if (!commonList) {
    return;
  }

  var hasNormalizedToPositionLiftedOut = false;
  var hasNormalizedFromPositionLiftedOut = false;
  var oldFrom = normalizedSelection.from,
      oldTo = normalizedSelection.to;
  var nodeRanges = splitRangeSelection(normalizedSelection);
  nodeRanges.forEach(function (range) {
    var $from = tr.doc.resolve(tr.mapping.map(range.from));
    var $to = tr.doc.resolve(tr.mapping.map(range.to));
    var mappedRange = $from.blockRange($to, isListNode);

    if (!mappedRange) {
      return;
    }

    if (isListItemNode($from.node(mappedRange.depth - 1))) {
      outdentRangeToParentList({
        tr: tr,
        range: mappedRange
      });
    } else {
      extractListItemsRangeFromList({
        tr: tr,
        range: mappedRange
      });
      hasNormalizedToPositionLiftedOut = hasNormalizedToPositionLiftedOut || oldTo >= range.from && oldTo < range.to;
      hasNormalizedFromPositionLiftedOut = hasNormalizedFromPositionLiftedOut || oldFrom >= range.from && oldFrom < range.to;
    }
  });
  var hasCommonListMoved = commonList.start !== tr.mapping.map(commonList.start);
  var nextSelection = calculateNewSelection({
    originalSelection: originalSelection,
    normalizedSelection: normalizedSelection,
    tr: tr,
    hasCommonListMoved: hasCommonListMoved,
    hasNormalizedToPositionLiftedOut: hasNormalizedToPositionLiftedOut,
    hasNormalizedFromPositionLiftedOut: hasNormalizedFromPositionLiftedOut
  });
  tr.setSelection(nextSelection);
  joinSiblingLists({
    tr: tr,
    direction: JoinDirection.RIGHT
  });
};

var calculateNewSelection = function calculateNewSelection(_ref) {
  var tr = _ref.tr,
      originalSelection = _ref.originalSelection,
      normalizedSelection = _ref.normalizedSelection,
      hasCommonListMoved = _ref.hasCommonListMoved,
      hasNormalizedToPositionLiftedOut = _ref.hasNormalizedToPositionLiftedOut,
      hasNormalizedFromPositionLiftedOut = _ref.hasNormalizedFromPositionLiftedOut;
  var $from = normalizedSelection.$from,
      $to = normalizedSelection.$to;
  var isCursorSelection = normalizedSelection.empty;
  var from = tr.mapping.map($from.pos);
  var to = tr.mapping.map($to.pos);
  var LIST_STRUCTURE_CHANGED_OFFSET = 2;
  var isToFromSameListItem = $from.sameParent($to);

  if (hasNormalizedFromPositionLiftedOut) {
    var fromMapped = isToFromSameListItem ? $from.pos : from;
    from = hasNormalizedFromPositionLiftedOut ? $from.pos : fromMapped;
    from = hasCommonListMoved ? from - LIST_STRUCTURE_CHANGED_OFFSET : from;
    from = Math.max(from, 0);
  }

  if (hasNormalizedToPositionLiftedOut) {
    var toMapped = isToFromSameListItem ? $to.pos : to;
    to = hasNormalizedToPositionLiftedOut ? $to.pos : toMapped;
    to = hasCommonListMoved ? to - LIST_STRUCTURE_CHANGED_OFFSET : to;
    to = Math.min(to, tr.doc.nodeSize - 2);
  }

  if (normalizedSelection instanceof GapCursorSelection) {
    var nextSelectionFrom = tr.doc.resolve(from);
    return new GapCursorSelection(nextSelectionFrom, normalizedSelection.side);
  }

  if (originalSelection instanceof NodeSelection) {
    return NodeSelection.create(tr.doc, from);
  }

  if (isCursorSelection) {
    return TextSelection.between(tr.doc.resolve(to), tr.doc.resolve(to), -1);
  }

  return TextSelection.between(tr.doc.resolve(from), tr.doc.resolve(to), -1);
};

var splitRangeSelection = function splitRangeSelection(selection) {
  var commonListRange = createListNodeRange({
    selection: selection
  });

  if (!commonListRange) {
    return [];
  }

  var $from = selection.$from,
      $to = selection.$to;

  if ($from.pos === $to.pos && $from.sameParent($to)) {
    return [{
      from: commonListRange.start,
      to: commonListRange.end,
      depth: commonListRange.depth
    }];
  }

  var lastListItem = findPreviousListItemSibling($from);

  if (!lastListItem) {
    return [];
  }

  var nodeRanges = [];
  var doc = $from.doc;
  var previousListItem = findPreviousListItemSibling($to);

  while (previousListItem && previousListItem.pos >= lastListItem.pos && previousListItem.pos >= commonListRange.start) {
    var node = doc.nodeAt(previousListItem.pos);

    if (!node || !isListItemNode(node)) {
      return [];
    }

    var offset = 0;

    if (node && node.lastChild && isListNode(node.lastChild)) {
      offset = node.lastChild.nodeSize;
    }

    var start = previousListItem.pos + 1;
    nodeRanges.push({
      from: start,
      to: doc.resolve(start).end() - offset,
      depth: previousListItem.depth
    });
    previousListItem = findPreviousListItemSibling(previousListItem);
  }

  return nodeRanges;
};

var outdentRangeToParentList = function outdentRangeToParentList(_ref2) {
  var tr = _ref2.tr,
      range = _ref2.range;
  var end = range.end;
  var endOfList = range.$to.end(range.depth);
  var listItem = tr.doc.type.schema.nodes.listItem;

  if (end < endOfList) {
    var slice = new Slice(Fragment.from(listItem.create(null, range.parent.copy())), 1, 0);
    var step = new ReplaceAroundStep(end - 1, endOfList, end, endOfList, slice, 1, true);
    tr.step(step);
    range = new NodeRange(tr.doc.resolve(range.$from.pos), tr.doc.resolve(endOfList), range.depth);
  }

  var target = liftTarget(range);

  if (target) {
    tr.lift(range, target);
  }
};

var extractListItemsRangeFromList = function extractListItemsRangeFromList(_ref3) {
  var tr = _ref3.tr,
      range = _ref3.range;
  var list = range.parent;
  var $start = tr.doc.resolve(range.start);
  var listStart = $start.start(range.depth);
  var listEnd = $start.end(range.depth);
  var isAtTop = listStart === range.start;
  var isAtBottom = listEnd === range.end;
  var isTheEntireList = isAtTop && isAtBottom;
  var listItemContent = isAtTop ? Fragment.empty : Fragment.from(list.copy(Fragment.empty));

  for (var i = range.startIndex; i < range.endIndex; i++) {
    listItemContent = listItemContent.append(list.child(i).content);
  }

  if (isAtTop) {
    for (var _i = 0; _i < listItemContent.childCount; _i++) {
      var child = listItemContent.child(_i);

      if (child && isListNode(child) && child.type !== list.type) {
        var newNestedList = list.type.create(null, child.content);
        listItemContent = listItemContent.replaceChild(_i, newNestedList);
      }
    }
  }

  var nextListFragment = listItemContent.append(Fragment.from(list.copy(Fragment.empty)));

  if (isTheEntireList) {
    var slice = new Slice(listItemContent, 0, 0);
    var step = new ReplaceStep($start.pos - 1, range.end + 1, slice, false);
    tr.step(step);
  } else if (isAtTop) {
    var _slice = new Slice(nextListFragment, 0, 1);

    var _step = new ReplaceStep($start.pos - 1, range.end, _slice, false);

    tr.step(_step);
  } else if (isAtBottom) {
    var _slice2 = new Slice(listItemContent, 1, 0);

    var _step2 = new ReplaceStep($start.pos, listEnd + 1, _slice2, false);

    tr.step(_step2);
  } else {
    var _slice3 = new Slice(nextListFragment, 1, 1);

    var _step3 = new ReplaceAroundStep($start.pos, listEnd, range.end, listEnd, _slice3, _slice3.size, false);

    tr.step(_step3);
  }
};

var findPreviousListItemSibling = function findPreviousListItemSibling($pos) {
  var doc = $pos.doc;
  var isPositionListItem = isListNode($pos.node());
  var listItemPosition = $pos;

  if (!isPositionListItem) {
    var listItem = findFirstParentListItemNode($pos);

    if (!listItem) {
      return null;
    }

    return doc.resolve(listItem.pos);
  }

  var resolved = doc.resolve(listItemPosition.pos);
  var foundPosition = Selection.findFrom(resolved, -1);

  if (!foundPosition) {
    return null;
  }

  var parentListItemNode = findFirstParentListItemNode(foundPosition.$from);

  if (!parentListItemNode) {
    return null;
  }

  return doc.resolve(parentListItemNode.pos);
};