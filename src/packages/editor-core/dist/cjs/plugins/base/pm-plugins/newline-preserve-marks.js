"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newlinePreserveMarksKey = exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _prosemirrorKeymap = require("prosemirror-keymap");

var _commands = require("../../../utils/commands");

var _typeAhead = require("../../../plugins/type-ahead");

var _utils = require("../../../utils");

var newlinePreserveMarksKey = new _prosemirrorState.PluginKey('newlinePreserveMarksPlugin');
exports.newlinePreserveMarksKey = newlinePreserveMarksKey;

var isSelectionAligned = function isSelectionAligned(state) {
  return !!state.selection.$to.parent.marks.find(function (m) {
    return m.type === state.schema.marks.alignment;
  });
};

var isTypeaheadNotDisplaying = function isTypeaheadNotDisplaying(state) {
  return !_typeAhead.typeAheadPluginKey.getState(state).active;
};

var splitBlockPreservingMarks = function splitBlockPreservingMarks(state, dispatch) {
  if (dispatch) {
    dispatch(state.tr.split(state.tr.mapping.map(state.selection.$from.pos), 1));
  }

  return true;
};

var _default = function _default() {
  return new _safePlugin.SafePlugin({
    key: newlinePreserveMarksKey,
    props: {
      handleKeyDown: (0, _prosemirrorKeymap.keydownHandler)({
        Enter: (0, _commands.filter)([_utils.isSelectionEndOfParagraph, isSelectionAligned, isTypeaheadNotDisplaying], splitBlockPreservingMarks)
      })
    }
  });
};

exports.default = _default;