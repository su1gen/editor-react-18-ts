"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findInsertLocation = findInsertLocation;
exports.getSelectionType = getSelectionType;
exports.getStateContext = getStateContext;

var _analytics = require("@atlaskit/editor-common/analytics");

var _cellSelection = require("@atlaskit/editor-tables/cell-selection");

var _prosemirrorUtils = require("prosemirror-utils");

var _prosemirrorState = require("prosemirror-state");

function getSelectionType(state) {
  var _selection$constructo;

  var selection = state.selection;
  var type;
  var position;

  if ((selection === null || selection === void 0 ? void 0 : (_selection$constructo = selection.constructor) === null || _selection$constructo === void 0 ? void 0 : _selection$constructo.name) === 'GapCursorSelection') {
    type = _analytics.SELECTION_TYPE.GAP_CURSOR;
    position = selection.side;
  } else if (selection instanceof _cellSelection.CellSelection) {
    type = _analytics.SELECTION_TYPE.CELL;
  } else if (selection instanceof _prosemirrorState.NodeSelection) {
    type = _analytics.SELECTION_TYPE.NODE;
  } else if (selection.from !== selection.to) {
    type = _analytics.SELECTION_TYPE.RANGED;
  } else {
    type = _analytics.SELECTION_TYPE.CURSOR;
    var from = selection.from,
        $from = selection.$from;

    if (from === $from.start()) {
      position = _analytics.SELECTION_POSITION.START;
    } else if (from === $from.end()) {
      position = _analytics.SELECTION_POSITION.END;
    } else {
      position = _analytics.SELECTION_POSITION.MIDDLE;
    }
  }

  return {
    type: type,
    position: position
  };
}

function findInsertLocation(state) {
  var selection = state.selection;

  if (selection instanceof _prosemirrorState.NodeSelection) {
    return selection.node.type.name;
  }

  if (selection instanceof _cellSelection.CellSelection) {
    return state.schema.nodes.table.name;
  } // Text selection


  var parentNodeInfo = (0, _prosemirrorUtils.findParentNode)(function (node) {
    return node.type !== state.schema.nodes.paragraph;
  })(state.selection);
  return parentNodeInfo ? parentNodeInfo.node.type.name : state.doc.type.name;
}

function getStateContext(state, payload) {
  if (!payload.attributes) {
    return payload;
  }

  var _getSelectionType = getSelectionType(state),
      type = _getSelectionType.type,
      position = _getSelectionType.position;

  payload.attributes.selectionType = type;

  if (position) {
    payload.attributes.selectionPosition = position;
  }

  var insertLocation = findInsertLocation(state);

  if (payload.action === _analytics.ACTION.INSERTED && payload.actionSubject === _analytics.ACTION_SUBJECT.DOCUMENT && payload.attributes) {
    payload.attributes.insertLocation = insertLocation;
  } else {
    payload.attributes.nodeLocation = insertLocation;
  }

  return payload;
}