import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { CellSelection } from '@atlaskit/editor-tables/cell-selection';
import { NodeSelection, TextSelection, AllSelection } from 'prosemirror-state';
import { GapCursorSelection } from '@atlaskit/editor-common/selection';
export { setNodeSelection, setTextSelection } from '@atlaskit/editor-common/utils';
export function setAllSelection(view) {
  var state = view.state,
      dispatch = view.dispatch;
  var tr = state.tr.setSelection(new AllSelection(view.state.doc));
  dispatch(tr);
}
export function setGapCursorSelection(view, pos, side) {
  var state = view.state;
  view.dispatch(state.tr.setSelection(new GapCursorSelection(state.doc.resolve(pos), side)));
}
export function setCellSelection(view, anchor, head) {
  var state = view.state,
      dispatch = view.dispatch;
  dispatch(state.tr.setSelection(CellSelection.create(state.doc, anchor, head)));
}
export var normaliseNestedLayout = function normaliseNestedLayout(_ref, node) {
  var selection = _ref.selection,
      doc = _ref.doc;

  if (selection.$from.depth > 1) {
    if (node.attrs.layout && node.attrs.layout !== 'default') {
      return node.type.createChecked(_objectSpread(_objectSpread({}, node.attrs), {}, {
        layout: 'default'
      }), node.content, node.marks);
    } // If its a breakout layout, we can remove the mark
    // Since default isn't a valid breakout mode.


    var breakoutMark = doc.type.schema.marks.breakout;

    if (breakoutMark && breakoutMark.isInSet(node.marks)) {
      var newMarks = breakoutMark.removeFromSet(node.marks);
      return node.type.createChecked(node.attrs, node.content, newMarks);
    }
  }

  return node;
}; // checks if the given position is within the ProseMirror document

export var isValidPosition = function isValidPosition(pos, state) {
  if (pos >= 0 && pos <= state.doc.resolve(0).end()) {
    return true;
  }

  return false;
};
export var duplicateSelection = function duplicateSelection(selectionToDuplicate, doc) {
  if (selectionToDuplicate instanceof NodeSelection) {
    return NodeSelection.create(doc, selectionToDuplicate.from);
  } else if (selectionToDuplicate instanceof TextSelection) {
    return TextSelection.create(doc, selectionToDuplicate.from, selectionToDuplicate.to);
  } else if (selectionToDuplicate instanceof GapCursorSelection) {
    return new GapCursorSelection(doc.resolve(selectionToDuplicate.from), selectionToDuplicate.side);
  } else if (selectionToDuplicate instanceof CellSelection) {
    return new CellSelection(doc.resolve(selectionToDuplicate.$anchorCell.pos), doc.resolve(selectionToDuplicate.$headCell.pos));
  }
};