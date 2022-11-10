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
export var historyPluginKey = new PluginKey('historyPlugin');

var getInitialState = function getInitialState() {
  return {
    canUndo: false,
    canRedo: false
  };
};

var _pluginFactory = pluginFactory(historyPluginKey, reducer),
    createPluginState = _pluginFactory.createPluginState,
    getPluginState = _pluginFactory.getPluginState;

var createPlugin = function createPlugin(dispatch) {
  return new SafePlugin({
    state: createPluginState(dispatch, getInitialState),
    key: historyPluginKey,
    appendTransaction: function appendTransaction(transactions, oldState, newState) {
      if (transactions.find(function (tr) {
        return tr.docChanged && tr.getMeta('addToHistory') !== false;
      })) {
        var pmHistoryPluginState = getPmHistoryPluginState(newState);

        if (!pmHistoryPluginState) {
          return;
        }

        var canUndo = pmHistoryPluginState.done.eventCount > 0;
        var canRedo = pmHistoryPluginState.undone.eventCount > 0;

        var _getPluginState = getPluginState(newState),
            prevCanUndo = _getPluginState.canUndo,
            prevCanRedo = _getPluginState.canRedo;

        if (canUndo !== prevCanUndo || canRedo !== prevCanRedo) {
          var action = {
            type: HistoryActionTypes.UPDATE,
            canUndo: canUndo,
            canRedo: canRedo
          };
          return newState.tr.setMeta(historyPluginKey, action);
        }
      }
    }
  });
};

var historyPlugin = function historyPlugin() {
  return {
    name: 'history',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'history',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch);
        }
      }];
    }
  };
};

export default historyPlugin;