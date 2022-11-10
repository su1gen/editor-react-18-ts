import React from 'react';
import { alignment } from '@atlaskit/adf-schema';
import WithPluginState from '../../ui/WithPluginState';
import { pluginKey, createPlugin } from './pm-plugins/main';
import { changeAlignment as _changeAlignment } from './commands';
import ToolbarAlignment from './ui/ToolbarAlignment';
import { keymapPlugin } from './pm-plugins/keymap';
export var defaultConfig = {
  align: 'start'
};

var alignmentPlugin = function alignmentPlugin() {
  return {
    name: 'alignment',
    marks: function marks() {
      return [{
        name: 'alignment',
        mark: alignment
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'alignmentPlugin',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch, defaultConfig);
        }
      }, {
        name: 'annotationKeymap',
        plugin: function plugin() {
          return keymapPlugin();
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref2) {
      var editorView = _ref2.editorView,
          popupsMountPoint = _ref2.popupsMountPoint,
          popupsBoundariesElement = _ref2.popupsBoundariesElement,
          popupsScrollableElement = _ref2.popupsScrollableElement,
          disabled = _ref2.disabled,
          isToolbarReducedSpacing = _ref2.isToolbarReducedSpacing;
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          align: pluginKey
        },
        render: function render(_ref3) {
          var align = _ref3.align;
          return /*#__PURE__*/React.createElement(ToolbarAlignment, {
            pluginState: align,
            isReducedSpacing: isToolbarReducedSpacing,
            changeAlignment: function changeAlignment(align) {
              return _changeAlignment(align)(editorView.state, editorView.dispatch);
            },
            disabled: disabled || !align.isEnabled,
            popupsMountPoint: popupsMountPoint,
            popupsBoundariesElement: popupsBoundariesElement,
            popupsScrollableElement: popupsScrollableElement
          });
        }
      });
    }
  };
};

export default alignmentPlugin;