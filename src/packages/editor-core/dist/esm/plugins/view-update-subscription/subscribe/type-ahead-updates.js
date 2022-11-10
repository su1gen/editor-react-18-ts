import { trackerStore } from '..';
import { pluginKey as typeAheadPluginKey } from '../../type-ahead/pm-plugins/key';
export var subscribeTypeAheadUpdates = function subscribeTypeAheadUpdates(editorView, cb) {
  var subscription = function subscription(_ref) {
    var newEditorState = _ref.newEditorState,
        oldEditorState = _ref.oldEditorState;
    var newPluginState = typeAheadPluginKey.getState(newEditorState);
    var oldPluginState = typeAheadPluginKey.getState(oldEditorState);

    if (!oldPluginState || !newPluginState) {
      return;
    }

    cb({
      oldPluginState: oldPluginState,
      newPluginState: newPluginState
    });
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