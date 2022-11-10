import React from 'react';
import { createPlugin } from './plugin';
import keymapPlugin from './keymap';
import FindReplaceToolbarButtonWithState from './FindReplaceToolbarButtonWithState';
export const findReplacePlugin = props => {
  return {
    name: 'findReplace',

    pmPlugins() {
      return [{
        name: 'findReplace',
        plugin: ({
          dispatch
        }) => createPlugin(dispatch)
      }, {
        name: 'findReplaceKeymap',
        plugin: () => keymapPlugin()
      }];
    },

    primaryToolbarComponent({
      popupsBoundariesElement,
      popupsMountPoint,
      popupsScrollableElement,
      isToolbarReducedSpacing,
      editorView,
      containerElement,
      dispatchAnalyticsEvent
    }) {
      if (props.twoLineEditorToolbar) {
        return null;
      } else {
        return /*#__PURE__*/React.createElement(FindReplaceToolbarButtonWithState, {
          popupsBoundariesElement: popupsBoundariesElement,
          popupsMountPoint: popupsMountPoint,
          popupsScrollableElement: popupsScrollableElement,
          isToolbarReducedSpacing: isToolbarReducedSpacing,
          editorView: editorView,
          containerElement: containerElement,
          dispatchAnalyticsEvent: dispatchAnalyticsEvent,
          takeFullWidth: props.takeFullWidth
        });
      }
    }

  };
};
export default findReplacePlugin;