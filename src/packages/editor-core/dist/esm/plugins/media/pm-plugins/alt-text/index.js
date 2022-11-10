import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { pluginFactory } from '../../../../utils/plugin-state-factory';
import reducer from './reducer';
import { pmHistoryPluginKey } from '../../../history/pm-history-types';
export var pluginKey = new PluginKey('mediaAltTextPlugin');

var _pluginFactory = pluginFactory(pluginKey, reducer, {
  onSelectionChanged: function onSelectionChanged(tr, newState) {
    // dont close alt text for undo/redo transactions (if it comes from prosemirror-history)
    if (tr.getMeta(pmHistoryPluginKey)) {
      return newState;
    }

    return {
      isAltTextEditorOpen: false
    };
  }
}),
    createPluginState = _pluginFactory.createPluginState,
    createCommand = _pluginFactory.createCommand,
    getPluginState = _pluginFactory.getPluginState;

export var createPlugin = function createPlugin(_ref) {
  var dispatch = _ref.dispatch,
      providerFactory = _ref.providerFactory;
  return new SafePlugin({
    state: createPluginState(dispatch, {
      isAltTextEditorOpen: false
    }),
    key: pluginKey,
    view: function view() {
      return {
        update: function update(view, prev) {
          var pluginState = getPluginState(view.state);
          var oldPluginState = getPluginState(prev);

          if (pluginState && oldPluginState && oldPluginState.isAltTextEditorOpen && !pluginState.isAltTextEditorOpen && !view.hasFocus()) {
            view.focus();
          }
        }
      };
    }
  });
};
export { createCommand, getPluginState };