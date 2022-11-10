"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normaliseNestedLayout = exports.isValidPosition = exports.duplicateSelection = void 0;
exports.setAllSelection = setAllSelection;
exports.setCellSelection = setCellSelection;
exports.setGapCursorSelection = setGapCursorSelection;
Object.defineProperty(exports, "setNodeSelection", {
  enumerable: true,
  get: function get() {
    return _utils.setNodeSelection;
  }
});
Object.defineProperty(exports, "setTextSelection", {
  enumerable: true,
  get: function get() {
    return _utils.setTextSelection;
  }
});

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _cellSelection = require("@atlaskit/editor-tables/cell-selection");

var _prosemirrorState = require("prosemirror-state");

var _selection = require("@atlaskit/editor-common/selection");

var _utils = require("@atlaskit/editor-common/utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function setAllSelection(view) {
  var state = view.state,
      dispatch = view.dispatch;
  var tr = state.tr.setSelection(new _prosemirrorState.AllSelection(view.state.doc));
  dispatch(tr);
}

function setGapCursorSelection(view, pos, side) {
  var state = view.state;
  view.dispatch(state.tr.setSelection(new _selection.GapCursorSelection(state.doc.resolve(pos), side)));
}

function setCellSelection(view, anchor, head) {
  var state = view.state,
      dispatch = view.dispatch;
  dispatch(state.tr.setSelection(_cellSelection.CellSelection.create(state.doc, anchor, head)));
}

var normaliseNestedLayout = function normaliseNestedLayout(_ref, node) {
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


exports.normaliseNestedLayout = normaliseNestedLayout;

var isValidPosition = function isValidPosition(pos, state) {
  if (pos >= 0 && pos <= state.doc.resolve(0).end()) {
    return true;
  }

  return false;
};

exports.isValidPosition = isValidPosition;

var duplicateSelection = function duplicateSelection(selectionToDuplicate, doc) {
  if (selectionToDuplicate instanceof _prosemirrorState.NodeSelection) {
    return _prosemirrorState.NodeSelection.create(doc, selectionToDuplicate.from);
  } else if (selectionToDuplicate instanceof _prosemirrorState.TextSelection) {
    return _prosemirrorState.TextSelection.create(doc, selectionToDuplicate.from, selectionToDuplicate.to);
  } else if (selectionToDuplicate instanceof _selection.GapCursorSelection) {
    return new _selection.GapCursorSelection(doc.resolve(selectionToDuplicate.from), selectionToDuplicate.side);
  } else if (selectionToDuplicate instanceof _cellSelection.CellSelection) {
    return new _cellSelection.CellSelection(doc.resolve(selectionToDuplicate.$anchorCell.pos), doc.resolve(selectionToDuplicate.$headCell.pos));
  }
};

exports.duplicateSelection = duplicateSelection;