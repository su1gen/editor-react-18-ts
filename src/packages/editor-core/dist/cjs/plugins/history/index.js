"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.historyPluginKey = exports.default = void 0;

var _pluginStateFactory = require("../../utils/plugin-state-factory");

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _reducer = _interopRequireDefault(require("./reducer"));

var _actions = require("./actions");

var _utils = require("./utils");

/**
 * Plugin that keeps track of whether undo and redo are currently available
 * This is needed so we can enable/disable controls appropriately
 *
 * Actual undo/redo functionality is handled by prosemirror-history:
 * https://github.com/ProseMirror/prosemirror-history
 */
var historyPluginKey = new _prosemirrorState.PluginKey('historyPlugin');
exports.historyPluginKey = historyPluginKey;

var getInitialState = function getInitialState() {
  return {
    canUndo: false,
    canRedo: false
  };
};

var _pluginFactory = (0, _pluginStateFactory.pluginFactory)(historyPluginKey, _reducer.default),
    createPluginState = _pluginFactory.createPluginState,
    getPluginState = _pluginFactory.getPluginState;

var createPlugin = function createPlugin(dispatch) {
  return new _safePlugin.SafePlugin({
    state: createPluginState(dispatch, getInitialState),
    key: historyPluginKey,
    appendTransaction: function appendTransaction(transactions, oldState, newState) {
      if (transactions.find(function (tr) {
        return tr.docChanged && tr.getMeta('addToHistory') !== false;
      })) {
        var pmHistoryPluginState = (0, _utils.getPmHistoryPluginState)(newState);

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
            type: _actions.HistoryActionTypes.UPDATE,
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

var _default = historyPlugin;
exports.default = _default;