"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.outdentListItemsSelected = void 0;

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorModel = require("prosemirror-model");

var _prosemirrorTransform = require("prosemirror-transform");

var _node = require("../utils/node");

var _find = require("../utils/find");

var _selection = require("../utils/selection");

var _gapCursorSelection = require("../../selection/gap-cursor-selection");

var outdentListItemsSelected = function outdentListItemsSelected(tr) {
  var originalSelection = tr.selection;
  var normalizedSelection = (0, _selection.normalizeListItemsSelection)({
    selection: tr.selection,
    doc: tr.doc
  });
  var rootList = (0, _find.findRootParentListNode)(normalizedSelection.$from);

  if (!rootList) {
    return;
  }

  var commonList = normalizedSelection.$from.blockRange(rootList, _node.isListNode);

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
    var mappedRange = $from.blockRange($to, _node.isListNode);

    if (!mappedRange) {
      return;
    }

    if ((0, _node.isListItemNode)($from.node(mappedRange.depth - 1))) {
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
  (0, _node.joinSiblingLists)({
    tr: tr,
    direction: _node.JoinDirection.RIGHT
  });
};

exports.outdentListItemsSelected = outdentListItemsSelected;

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

  if (normalizedSelection instanceof _gapCursorSelection.GapCursorSelection) {
    var nextSelectionFrom = tr.doc.resolve(from);
    return new _gapCursorSelection.GapCursorSelection(nextSelectionFrom, normalizedSelection.side);
  }

  if (originalSelection instanceof _prosemirrorState.NodeSelection) {
    return _prosemirrorState.NodeSelection.create(tr.doc, from);
  }

  if (isCursorSelection) {
    return _prosemirrorState.TextSelection.between(tr.doc.resolve(to), tr.doc.resolve(to), -1);
  }

  return _prosemirrorState.TextSelection.between(tr.doc.resolve(from), tr.doc.resolve(to), -1);
};

var splitRangeSelection = function splitRangeSelection(selection) {
  var commonListRange = (0, _selection.createListNodeRange)({
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

    if (!node || !(0, _node.isListItemNode)(node)) {
      return [];
    }

    var offset = 0;

    if (node && node.lastChild && (0, _node.isListNode)(node.lastChild)) {
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
    var slice = new _prosemirrorModel.Slice(_prosemirrorModel.Fragment.from(listItem.create(null, range.parent.copy())), 1, 0);
    var step = new _prosemirrorTransform.ReplaceAroundStep(end - 1, endOfList, end, endOfList, slice, 1, true);
    tr.step(step);
    range = new _prosemirrorModel.NodeRange(tr.doc.resolve(range.$from.pos), tr.doc.resolve(endOfList), range.depth);
  }

  var target = (0, _prosemirrorTransform.liftTarget)(range);

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
  var listItemContent = isAtTop ? _prosemirrorModel.Fragment.empty : _prosemirrorModel.Fragment.from(list.copy(_prosemirrorModel.Fragment.empty));

  for (var i = range.startIndex; i < range.endIndex; i++) {
    listItemContent = listItemContent.append(list.child(i).content);
  }

  if (isAtTop) {
    for (var _i = 0; _i < listItemContent.childCount; _i++) {
      var child = listItemContent.child(_i);

      if (child && (0, _node.isListNode)(child) && child.type !== list.type) {
        var newNestedList = list.type.create(null, child.content);
        listItemContent = listItemContent.replaceChild(_i, newNestedList);
      }
    }
  }

  var nextListFragment = listItemContent.append(_prosemirrorModel.Fragment.from(list.copy(_prosemirrorModel.Fragment.empty)));

  if (isTheEntireList) {
    var slice = new _prosemirrorModel.Slice(listItemContent, 0, 0);
    var step = new _prosemirrorTransform.ReplaceStep($start.pos - 1, range.end + 1, slice, false);
    tr.step(step);
  } else if (isAtTop) {
    var _slice = new _prosemirrorModel.Slice(nextListFragment, 0, 1);

    var _step = new _prosemirrorTransform.ReplaceStep($start.pos - 1, range.end, _slice, false);

    tr.step(_step);
  } else if (isAtBottom) {
    var _slice2 = new _prosemirrorModel.Slice(listItemContent, 1, 0);

    var _step2 = new _prosemirrorTransform.ReplaceStep($start.pos, listEnd + 1, _slice2, false);

    tr.step(_step2);
  } else {
    var _slice3 = new _prosemirrorModel.Slice(nextListFragment, 1, 1);

    var _step3 = new _prosemirrorTransform.ReplaceAroundStep($start.pos, listEnd, range.end, listEnd, _slice3, _slice3.size, false);

    tr.step(_step3);
  }
};

var findPreviousListItemSibling = function findPreviousListItemSibling($pos) {
  var doc = $pos.doc;
  var isPositionListItem = (0, _node.isListNode)($pos.node());
  var listItemPosition = $pos;

  if (!isPositionListItem) {
    var listItem = (0, _find.findFirstParentListItemNode)($pos);

    if (!listItem) {
      return null;
    }

    return doc.resolve(listItem.pos);
  }

  var resolved = doc.resolve(listItemPosition.pos);

  var foundPosition = _prosemirrorState.Selection.findFrom(resolved, -1);

  if (!foundPosition) {
    return null;
  }

  var parentListItemNode = (0, _find.findFirstParentListItemNode)(foundPosition.$from);

  if (!parentListItemNode) {
    return null;
  }

  return doc.resolve(parentListItemNode.pos);
};