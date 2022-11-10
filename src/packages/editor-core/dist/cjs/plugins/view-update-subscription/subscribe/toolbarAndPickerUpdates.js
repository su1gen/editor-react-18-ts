"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeToToolbarAndPickerUpdates = void 0;

var _pluginKey = require("../../date/pm-plugins/plugin-key");

var _floatingToolbar = require("../../floating-toolbar");

var _pluginKey2 = require("../../status/plugin-key");

var _Toolbar = require("../../floating-toolbar/ui/Toolbar");

var _utils = require("../../type-ahead/utils");

var _ = require("..");

var areToolbarsSame = function areToolbarsSame(left, right) {
  if (!left && !right) {
    return true;
  }

  if (left && !right || !left && right) {
    return false;
  }

  var leftConfig = left.config;
  var rightConfig = right.config;

  if (!leftConfig && !rightConfig) {
    return true;
  }

  if (!leftConfig && rightConfig || leftConfig && !rightConfig) {
    return false;
  }

  var leftItems = Array.isArray(leftConfig.items) ? leftConfig.items : leftConfig.items(left.node);
  var rightItems = Array.isArray(rightConfig.items) ? rightConfig.items : rightConfig.items(right.node);
  return (0, _Toolbar.areSameItems)(leftItems, rightItems);
};

var subscribeToToolbarAndPickerUpdates = function subscribeToToolbarAndPickerUpdates(editorView, cb) {
  var lastUpdatedState = null;

  var subscription = function subscription(_ref) {
    var newEditorState = _ref.newEditorState;

    // TypeAhead has priority in the mobile-bridge
    // In case it is open we don't need to send
    // any toolbar updates don't need to be send
    if ((0, _utils.isTypeAheadOpen)(newEditorState)) {
      return;
    }

    var dateState = _pluginKey.pluginKey.getState(newEditorState);

    var statusState = _pluginKey2.pluginKey.getState(newEditorState);

    var _ref2 = _floatingToolbar.pluginKey.getState(newEditorState),
        getConfigWithNodeInfo = _ref2.getConfigWithNodeInfo;

    var toolbarConfig = getConfigWithNodeInfo(newEditorState);
    var shouldCallback = false;

    if (lastUpdatedState) {
      var oldDateState = _pluginKey.pluginKey.getState(lastUpdatedState);

      var oldStatusState = _pluginKey2.pluginKey.getState(lastUpdatedState);

      var _ref3 = _floatingToolbar.pluginKey.getState(lastUpdatedState),
          getOldConfigWithNodeInfo = _ref3.getConfigWithNodeInfo;

      var oldToolbarConfig = getOldConfigWithNodeInfo(lastUpdatedState);
      var isToolbarEqual = areToolbarsSame(toolbarConfig, oldToolbarConfig);

      if (dateState !== oldDateState || statusState !== oldStatusState || // Sometimes the toolbar changes while a picker is open, we dont care about this
      // EG A nested status or date node in a table
      !isToolbarEqual && !statusState.showStatusPickerAt && !dateState.showDatePickerAt) {
        shouldCallback = true;
      }
    } else {
      shouldCallback = true;
    }

    if (shouldCallback) {
      cb({
        dateState: dateState,
        statusState: statusState,
        toolbarConfig: toolbarConfig
      });
    }

    lastUpdatedState = newEditorState;
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

exports.subscribeToToolbarAndPickerUpdates = subscribeToToolbarAndPickerUpdates;