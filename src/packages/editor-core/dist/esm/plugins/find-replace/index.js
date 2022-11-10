import React from 'react';
import { createPlugin } from './plugin';
import keymapPlugin from './keymap';
import FindReplaceToolbarButtonWithState from './FindReplaceToolbarButtonWithState';
export var findReplacePlugin = function findReplacePlugin(props) {
  return {
    name: 'findReplace',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'findReplace',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch);
        }
      }, {
        name: 'findReplaceKeymap',
        plugin: function plugin() {
          return keymapPlugin();
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref2) {
      var popupsBoundariesElement = _ref2.popupsBoundariesElement,
          popupsMountPoint = _ref2.popupsMountPoint,
          popupsScrollableElement = _ref2.popupsScrollableElement,
          isToolbarReducedSpacing = _ref2.isToolbarReducedSpacing,
          editorView = _ref2.editorView,
          containerElement = _ref2.containerElement,
          dispatchAnalyticsEvent = _ref2.dispatchAnalyticsEvent;

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