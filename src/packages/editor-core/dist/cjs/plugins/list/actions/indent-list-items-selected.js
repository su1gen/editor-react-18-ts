"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.indentListItemsSelected = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorModel = require("prosemirror-model");

var _node = require("../utils/node");

var _find = require("../utils/find");

var _selection = require("../utils/selection");

var _gapCursorSelection = require("../../selection/gap-cursor-selection");

var indentListItemsSelected = function indentListItemsSelected(tr) {
  var originalSelection = tr.selection;
  var normalizedSelection = (0, _selection.normalizeListItemsSelection)({
    selection: originalSelection,
    doc: tr.doc
  });
  var $from = normalizedSelection.$from,
      $to = normalizedSelection.$to;
  var range = calculateRange({
    selection: normalizedSelection
  });

  if (!range) {
    return false;
  }

  var listItemsSelected = {
    from: (0, _find.findFirstParentListItemNode)($from),
    to: (0, _find.findFirstParentListItemNode)($to)
  };

  if (listItemsSelected.from === null || listItemsSelected.to === null) {
    return null;
  }

  var resolvedPos = tr.doc.resolve(listItemsSelected.from.pos);
  var listItemIndex = resolvedPos.index(); // @ts-ignore

  var positionListItemPosition = resolvedPos.posAtIndex(listItemIndex - 1);
  var previousListItem = tr.doc.nodeAt(positionListItemPosition);

  if (!previousListItem || !(0, _node.isListItemNode)(previousListItem)) {
    return null;
  }

  if ((0, _node.isListItemNode)(previousListItem) && listItemIndex === 0) {
    return null;
  }

  var listItemSelectedCommonParent = range.parent;
  var previousNestedList = (0, _node.isListNode)(previousListItem.lastChild) ? previousListItem.lastChild : null;
  var listNodeType = previousNestedList ? previousNestedList.type : listItemSelectedCommonParent.type;
  var nestedList = listItemsSelected.to.node.lastChild;
  var nestedItemsOffset = nestedList && (0, _node.isListNode)(nestedList) ? nestedList.nodeSize : 0;
  var from = listItemsSelected.from.pos;
  var to = listItemsSelected.to.pos + listItemsSelected.to.node.nodeSize - nestedItemsOffset;

  var _createIndentedListIt = createIndentedListItemsSlice({
    tr: tr,
    listNodeType: listNodeType,
    range: range,
    from: from,
    to: to
  }),
      _createIndentedListIt2 = (0, _slicedToArray2.default)(_createIndentedListIt, 2),
      sliceSelected = _createIndentedListIt2[0],
      nestedListItemsLeftover = _createIndentedListIt2[1];

  var hasPreviousNestedList = Boolean(previousNestedList);
  var start = from - 1;
  tr.replaceRange(hasPreviousNestedList ? start - 1 : start, range.end, sliceSelected);
  var leftoverContentPosition = tr.mapping.map(to) - 2;

  if (nestedListItemsLeftover.openStart === 0) {
    tr.insert(leftoverContentPosition, nestedListItemsLeftover.content);
  } else {
    tr.replace(leftoverContentPosition - nestedListItemsLeftover.openStart, leftoverContentPosition - nestedListItemsLeftover.openStart, nestedListItemsLeftover);
  }

  var nextSelection = calculateNewSelection({
    originalSelection: originalSelection,
    normalizedSelection: normalizedSelection,
    tr: tr,
    hasPreviousNestedList: hasPreviousNestedList
  });
  tr.setSelection(nextSelection);
};

exports.indentListItemsSelected = indentListItemsSelected;

var calculateRange = function calculateRange(_ref) {
  var selection = _ref.selection;
  var $from = selection.$from,
      $to = selection.$to;
  var range = $from.blockRange($to, _node.isListNode);

  if (!range) {
    return null;
  }

  return range;
};

var calculateNewSelection = function calculateNewSelection(_ref2) {
  var tr = _ref2.tr,
      normalizedSelection = _ref2.normalizedSelection,
      originalSelection = _ref2.originalSelection,
      hasPreviousNestedList = _ref2.hasPreviousNestedList;
  var offset = hasPreviousNestedList ? 2 : 0;
  var $from = normalizedSelection.$from,
      $to = normalizedSelection.$to;

  if (normalizedSelection instanceof _gapCursorSelection.GapCursorSelection) {
    var _nextSelectionFrom = tr.doc.resolve($from.pos - offset);

    return new _gapCursorSelection.GapCursorSelection(_nextSelectionFrom, normalizedSelection.side);
  }

  if (originalSelection instanceof _prosemirrorState.NodeSelection) {
    return _prosemirrorState.NodeSelection.create(tr.doc, $from.pos - offset);
  }

  var _Selection$near = _prosemirrorState.Selection.near(tr.doc.resolve($from.pos - offset)),
      nextSelectionFrom = _Selection$near.$from;

  var _Selection$near2 = _prosemirrorState.Selection.near(tr.doc.resolve($to.pos - offset), -1),
      nextSelectionTo = _Selection$near2.$to;

  return new _prosemirrorState.TextSelection(nextSelectionFrom, nextSelectionTo);
};

var createIndentedListItemsSlice = function createIndentedListItemsSlice(_ref3) {
  var tr = _ref3.tr,
      from = _ref3.from,
      to = _ref3.to,
      listNodeType = _ref3.listNodeType,
      range = _ref3.range;
  var listItemsSlice = tr.doc.slice(from, to - 2);

  var listFragment = _prosemirrorModel.Fragment.from(listNodeType.create(null, listItemsSlice.content));

  var nonSelectedListItemsSlice = tr.doc.slice(to, range.end - 2);
  var openStart = tr.doc.slice(from - 1, range.end).openStart;
  var slice = new _prosemirrorModel.Slice(listFragment, openStart, 0);
  return [slice, nonSelectedListItemsSlice];
};