"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeTypeAheadUpdates = void 0;

var _ = require("..");

var _key = require("../../type-ahead/pm-plugins/key");

var subscribeTypeAheadUpdates = function subscribeTypeAheadUpdates(editorView, cb) {
  var subscription = function subscription(_ref) {
    var newEditorState = _ref.newEditorState,
        oldEditorState = _ref.oldEditorState;

    var newPluginState = _key.pluginKey.getState(newEditorState);

    var oldPluginState = _key.pluginKey.getState(oldEditorState);

    if (!oldPluginState || !newPluginState) {
      return;
    }

    cb({
      oldPluginState: oldPluginState,
      newPluginState: newPluginState
    });
  };

  var tracker = _.trackerStore.get(editorView);

  if (tracker) {
    tracker.add(subscription);
  }

  return function () {
    var tracker = _.trackerStore.get(editorView);

    if (tracker) {
      tracker.remove(subscription);
    }
  };
};

exports.subscribeTypeAheadUpdates = subscribeTypeAheadUpdates;