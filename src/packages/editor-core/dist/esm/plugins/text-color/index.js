import React from 'react';
import { textColor } from '@atlaskit/adf-schema';
import WithPluginState from '../../ui/WithPluginState';
import { createPlugin, pluginKey as textColorPluginKey } from './pm-plugins/main';
import ToolbarTextColor from './ui/ToolbarTextColor';

var pluginConfig = function pluginConfig(textColorConfig) {
  if (!textColorConfig || typeof textColorConfig === 'boolean') {
    return undefined;
  }

  return textColorConfig;
};

var textColorPlugin = function textColorPlugin(textColorConfig) {
  return {
    name: 'textColor',
    marks: function marks() {
      return [{
        name: 'textColor',
        mark: textColor
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'textColor',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch, pluginConfig(textColorConfig));
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref2) {
      var editorView = _ref2.editorView,
          popupsMountPoint = _ref2.popupsMountPoint,
          popupsBoundariesElement = _ref2.popupsBoundariesElement,
          popupsScrollableElement = _ref2.popupsScrollableElement,
          isToolbarReducedSpacing = _ref2.isToolbarReducedSpacing,
          dispatchAnalyticsEvent = _ref2.dispatchAnalyticsEvent,
          disabled = _ref2.disabled;
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          textColor: textColorPluginKey
        },
        render: function render(_ref3) {
          var textColor = _ref3.textColor;
          return /*#__PURE__*/React.createElement(ToolbarTextColor, {
            pluginState: textColor,
            isReducedSpacing: isToolbarReducedSpacing,
            editorView: editorView,
            popupsMountPoint: popupsMountPoint,
            popupsBoundariesElement: popupsBoundariesElement,
            popupsScrollableElement: popupsScrollableElement,
            dispatchAnalyticsEvent: dispatchAnalyticsEvent,
            disabled: disabled
          });
        }
      });
    }
  };
};

export { textColorPluginKey };
export default textColorPlugin;