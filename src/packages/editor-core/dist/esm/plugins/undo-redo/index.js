import React from 'react';
import { keymapPlugin } from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
import { historyPluginKey } from '../history';
import ToolbarUndoRedo from './ui/ToolbarUndoRedo';
import WithPluginState from '../../ui/WithPluginState';

var undoRedoPlugin = function undoRedoPlugin() {
  return {
    name: 'undoRedoPlugin',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'undoRedoKeyMap',
        plugin: function plugin() {
          return keymapPlugin();
        }
      }, {
        name: 'undoRedoPlugin',
        plugin: function plugin(options) {
          return createPlugin(options);
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref) {
      var editorView = _ref.editorView,
          disabled = _ref.disabled,
          isToolbarReducedSpacing = _ref.isToolbarReducedSpacing;
      return /*#__PURE__*/React.createElement(WithPluginState, {
        plugins: {
          historyState: historyPluginKey
        },
        render: function render(_ref2) {
          var historyState = _ref2.historyState;
          return /*#__PURE__*/React.createElement(ToolbarUndoRedo, {
            isReducedSpacing: isToolbarReducedSpacing,
            disabled: disabled,
            historyState: historyState,
            editorView: editorView
          });
        }
      });
    }
  };
};

export default undoRedoPlugin;