import { pluginFactory } from '../../utils/plugin-state-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import reducer from './reducer';
import { HistoryActionTypes } from './actions';
import { getPmHistoryPluginState } from './utils';

/**
 * Plugin that keeps track of whether undo and redo are currently available
 * This is needed so we can enable/disable controls appropriately
 *
 * Actual undo/redo functionality is handled by prosemirror-history:
 * https://github.com/ProseMirror/prosemirror-history
 */
export const historyPluginKey = new PluginKey('historyPlugin');

const getInitialState = () => ({
  canUndo: false,
  canRedo: false
});

const {
  createPluginState,
  getPluginState
} = pluginFactory(historyPluginKey, reducer);

const createPlugin = dispatch => new SafePlugin({
  state: createPluginState(dispatch, getInitialState),
  key: historyPluginKey,
  appendTransaction: (transactions, oldState, newState) => {
    if (transactions.find(tr => tr.docChanged && tr.getMeta('addToHistory') !== false)) {
      const pmHistoryPluginState = getPmHistoryPluginState(newState);

      if (!pmHistoryPluginState) {
        return;
      }

      const canUndo = pmHistoryPluginState.done.eventCount > 0;
      const canRedo = pmHistoryPluginState.undone.eventCount > 0;
      const {
        canUndo: prevCanUndo,
        canRedo: prevCanRedo
      } = getPluginState(newState);

      if (canUndo !== prevCanUndo || canRedo !== prevCanRedo) {
        const action = {
          type: HistoryActionTypes.UPDATE,
          canUndo,
          canRedo
        };
        return newState.tr.setMeta(historyPluginKey, action);
      }
    }
  }
});

const historyPlugin = () => ({
  name: 'history',

  pmPlugins() {
    return [{
      name: 'history',
      plugin: ({
        dispatch
      }) => createPlugin(dispatch)
    }];
  }

});

export default historyPlugin;