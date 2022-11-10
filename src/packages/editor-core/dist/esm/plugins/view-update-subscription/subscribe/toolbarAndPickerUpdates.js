import { pluginKey as datePluginKey } from '../../date/pm-plugins/plugin-key';
import { pluginKey as floatingToolbarPluginKey } from '../../floating-toolbar';
import { pluginKey as statusPluginKey } from '../../status/plugin-key';
import { areSameItems } from '../../floating-toolbar/ui/Toolbar';
import { isTypeAheadOpen } from '../../type-ahead/utils';
import { trackerStore } from '..';

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
  return areSameItems(leftItems, rightItems);
};

export var subscribeToToolbarAndPickerUpdates = function subscribeToToolbarAndPickerUpdates(editorView, cb) {
  var lastUpdatedState = null;

  var subscription = function subscription(_ref) {
    var newEditorState = _ref.newEditorState;

    // TypeAhead has priority in the mobile-bridge
    // In case it is open we don't need to send
    // any toolbar updates don't need to be send
    if (isTypeAheadOpen(newEditorState)) {
      return;
    }

    var dateState = datePluginKey.getState(newEditorState);
    var statusState = statusPluginKey.getState(newEditorState);

    var _ref2 = floatingToolbarPluginKey.getState(newEditorState),
        getConfigWithNodeInfo = _ref2.getConfigWithNodeInfo;

    var toolbarConfig = getConfigWithNodeInfo(newEditorState);
    var shouldCallback = false;

    if (lastUpdatedState) {
      var oldDateState = datePluginKey.getState(lastUpdatedState);
      var oldStatusState = statusPluginKey.getState(lastUpdatedState);

      var _ref3 = floatingToolbarPluginKey.getState(lastUpdatedState),
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

  var tracker = trackerStore.get(editorView);

  if (tracker) {
    tracker.add(subscription);
  }

  return function () {
    var tracker = trackerStore.get(editorView);

    if (tracker) {
      tracker.remove(subscription);
    }
  };
};