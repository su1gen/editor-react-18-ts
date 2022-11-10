import React from 'react';
import { keymapPlugin } from './pm-plugins/keymaps';
import { createPlugin } from './pm-plugins/main';
import { historyPluginKey } from '../history';
import ToolbarUndoRedo from './ui/ToolbarUndoRedo';
import WithPluginState from '../../ui/WithPluginState';

const undoRedoPlugin = () => ({
  name: 'undoRedoPlugin',

  pmPlugins() {
    return [{
      name: 'undoRedoKeyMap',
      plugin: () => keymapPlugin()
    }, {
      name: 'undoRedoPlugin',
      plugin: options => createPlugin(options)
    }];
  },

  primaryToolbarComponent({
    editorView,
    disabled,
    isToolbarReducedSpacing
  }) {
    return /*#__PURE__*/React.createElement(WithPluginState, {
      plugins: {
        historyState: historyPluginKey
      },
      render: ({
        historyState
      }) => {
        return /*#__PURE__*/React.createElement(ToolbarUndoRedo, {
          isReducedSpacing: isToolbarReducedSpacing,
          disabled: disabled,
          historyState: historyState,
          editorView: editorView
        });
      }
    });
  }

});

export default undoRedoPlugin;