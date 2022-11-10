import { pluginKey as datePluginKey } from '../../date/pm-plugins/plugin-key';
import { pluginKey as floatingToolbarPluginKey } from '../../floating-toolbar';
import { pluginKey as statusPluginKey } from '../../status/plugin-key';
import { areSameItems } from '../../floating-toolbar/ui/Toolbar';
import { isTypeAheadOpen } from '../../type-ahead/utils';
import { trackerStore } from '..';

const areToolbarsSame = (left, right) => {
  if (!left && !right) {
    return true;
  }

  if (left && !right || !left && right) {
    return false;
  }

  const leftConfig = left.config;
  const rightConfig = right.config;

  if (!leftConfig && !rightConfig) {
    return true;
  }

  if (!leftConfig && rightConfig || leftConfig && !rightConfig) {
    return false;
  }

  const leftItems = Array.isArray(leftConfig.items) ? leftConfig.items : leftConfig.items(left.node);
  const rightItems = Array.isArray(rightConfig.items) ? rightConfig.items : rightConfig.items(right.node);
  return areSameItems(leftItems, rightItems);
};

export const subscribeToToolbarAndPickerUpdates = (editorView, cb) => {
  let lastUpdatedState = null;

  const subscription = ({
    newEditorState
  }) => {
    // TypeAhead has priority in the mobile-bridge
    // In case it is open we don't need to send
    // any toolbar updates don't need to be send
    if (isTypeAheadOpen(newEditorState)) {
      return;
    }

    const dateState = datePluginKey.getState(newEditorState);
    const statusState = statusPluginKey.getState(newEditorState);
    const {
      getConfigWithNodeInfo
    } = floatingToolbarPluginKey.getState(newEditorState);
    const toolbarConfig = getConfigWithNodeInfo(newEditorState);
    let shouldCallback = false;

    if (lastUpdatedState) {
      const oldDateState = datePluginKey.getState(lastUpdatedState);
      const oldStatusState = statusPluginKey.getState(lastUpdatedState);
      const {
        getConfigWithNodeInfo: getOldConfigWithNodeInfo
      } = floatingToolbarPluginKey.getState(lastUpdatedState);
      const oldToolbarConfig = getOldConfigWithNodeInfo(lastUpdatedState);
      const isToolbarEqual = areToolbarsSame(toolbarConfig, oldToolbarConfig);

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
        dateState,
        statusState,
        toolbarConfig
      });
    }

    lastUpdatedState = newEditorState;
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