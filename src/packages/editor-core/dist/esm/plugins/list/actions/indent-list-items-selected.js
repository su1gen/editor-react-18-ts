import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import { Selection, TextSelection, NodeSelection } from 'prosemirror-state';
import { Fragment, Slice } from 'prosemirror-model';
import { isListItemNode, isListNode } from '../utils/node';
import { findFirstParentListItemNode } from '../utils/find';
import { normalizeListItemsSelection } from '../utils/selection';
import { GapCursorSelection } from '../../selection/gap-cursor-selection';
export var indentListItemsSelected = function indentListItemsSelected(tr) {
  var originalSelection = tr.selection;
  var normalizedSelection = normalizeListItemsSelection({
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
    from: findFirstParentListItemNode($from),
    to: findFirstParentListItemNode($to)
  };

  if (listItemsSelected.from === null || listItemsSelected.to === null) {
    return null;
  }

  var resolvedPos = tr.doc.resolve(listItemsSelected.from.pos);
  var listItemIndex = resolvedPos.index(); // @ts-ignore

  var positionListItemPosition = resolvedPos.posAtIndex(listItemIndex - 1);
  var previousListItem = tr.doc.nodeAt(positionListItemPosition);

  if (!previousListItem || !isListItemNode(previousListItem)) {
    return null;
  }

  if (isListItemNode(previousListItem) && listItemIndex === 0) {
    return null;
  }

  var listItemSelectedCommonParent = range.parent;
  var previousNestedList = isListNode(previousListItem.lastChild) ? previousListItem.lastChild : null;
  var listNodeType = previousNestedList ? previousNestedList.type : listItemSelectedCommonParent.type;
  var nestedList = listItemsSelected.to.node.lastChild;
  var nestedItemsOffset = nestedList && isListNode(nestedList) ? nestedList.nodeSize : 0;
  var from = listItemsSelected.from.pos;
  var to = listItemsSelected.to.pos + listItemsSelected.to.node.nodeSize - nestedItemsOffset;

  var _createIndentedListIt = createIndentedListItemsSlice({
    tr: tr,
    listNodeType: listNodeType,
    range: range,
    from: from,
    to: to
  }),
      _createIndentedListIt2 = _slicedToArray(_createIndentedListIt, 2),
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

var calculateRange = function calculateRange(_ref) {
  var selection = _ref.selection;
  var $from = selection.$from,
      $to = selection.$to;
  var range = $from.blockRange($to, isListNode);

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

  if (normalizedSelection instanceof GapCursorSelection) {
    var _nextSelectionFrom = tr.doc.resolve($from.pos - offset);

    return new GapCursorSelection(_nextSelectionFrom, normalizedSelection.side);
  }

  if (originalSelection instanceof NodeSelection) {
    return NodeSelection.create(tr.doc, $from.pos - offset);
  }

  var _Selection$near = Selection.near(tr.doc.resolve($from.pos - offset)),
      nextSelectionFrom = _Selection$near.$from;

  var _Selection$near2 = Selection.near(tr.doc.resolve($to.pos - offset), -1),
      nextSelectionTo = _Selection$near2.$to;

  return new TextSelection(nextSelectionFrom, nextSelectionTo);
};

var createIndentedListItemsSlice = function createIndentedListItemsSlice(_ref3) {
  var tr = _ref3.tr,
      from = _ref3.from,
      to = _ref3.to,
      listNodeType = _ref3.listNodeType,
      range = _ref3.range;
  var listItemsSlice = tr.doc.slice(from, to - 2);
  var listFragment = Fragment.from(listNodeType.create(null, listItemsSlice.content));
  var nonSelectedListItemsSlice = tr.doc.slice(to, range.end - 2);
  var openStart = tr.doc.slice(from - 1, range.end).openStart;
  var slice = new Slice(listFragment, openStart, 0);
  return [slice, nonSelectedListItemsSlice];
};