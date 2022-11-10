"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKey = exports.getPluginState = exports.createPlugin = exports.createCommand = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _pluginStateFactory = require("../../../../utils/plugin-state-factory");

var _reducer = _interopRequireDefault(require("./reducer"));

var _pmHistoryTypes = require("../../../history/pm-history-types");

var pluginKey = new _prosemirrorState.PluginKey('mediaAltTextPlugin');
exports.pluginKey = pluginKey;

var _pluginFactory = (0, _pluginStateFactory.pluginFactory)(pluginKey, _reducer.default, {
  onSelectionChanged: function onSelectionChanged(tr, newState) {
    // dont close alt text for undo/redo transactions (if it comes from prosemirror-history)
    if (tr.getMeta(_pmHistoryTypes.pmHistoryPluginKey)) {
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

exports.getPluginState = getPluginState;
exports.createCommand = createCommand;

var createPlugin = function createPlugin(_ref) {
  var dispatch = _ref.dispatch,
      providerFactory = _ref.providerFactory;
  return new _safePlugin.SafePlugin({
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

exports.createPlugin = createPlugin;