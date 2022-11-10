import { trackerStore } from '..';
import { pluginKey as typeAheadPluginKey } from '../../type-ahead/pm-plugins/key';
export const subscribeTypeAheadUpdates = (editorView, cb) => {
  const subscription = ({
    newEditorState,
    oldEditorState
  }) => {
    const newPluginState = typeAheadPluginKey.getState(newEditorState);
    const oldPluginState = typeAheadPluginKey.getState(oldEditorState);

    if (!oldPluginState || !newPluginState) {
      return;
    }

    cb({
      oldPluginState,
      newPluginState
    });
  };

  const tracker = trackerStore.get(editorView);

  if (tracker) {
    tracker.add(subscription);
  }

  return () => {
    const tracker = trackerStore.get(editorView);

    if (tracker) {
      tracker.remove(subscription);
    }
  };
};