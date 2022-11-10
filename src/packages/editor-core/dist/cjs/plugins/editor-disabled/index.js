"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;
exports.pluginKey = exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _pluginStateFactory = require("../../utils/plugin-state-factory");

var pluginKey = new _prosemirrorState.PluginKey('editorDisabledPlugin');
exports.pluginKey = pluginKey;

function reducer(_pluginState, meta) {
  return meta;
}

var _pluginFactory = (0, _pluginStateFactory.pluginFactory)(pluginKey, reducer),
    createPluginState = _pluginFactory.createPluginState,
    getPluginState = _pluginFactory.getPluginState;
/*
Stores the state of the editor enabled/disabled for panel and floating
toolbar to subscribe to through <WithPluginState>. Otherwise the NodeViews
won't re-render when it changes.
*/


function createPlugin(dispatch) {
  return new _safePlugin.SafePlugin({
    key: pluginKey,
    state: createPluginState(dispatch, {
      editorDisabled: false
    }),
    view: function view() {
      return {
        update: function update(view) {
          if (getPluginState(view.state).editorDisabled !== !view.editable) {
            var tr = view.state.tr.setMeta(pluginKey, {
              editorDisabled: !view.editable
            });
            tr.setMeta('isLocal', true);
            view.dispatch(tr);
          }
        }
      };
    }
  });
}

var editorDisabledPlugin = function editorDisabledPlugin() {
  return {
    name: 'editorDisabled',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'editorDisabled',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch);
        }
      }];
    }
  };
};

var _default = editorDisabledPlugin;
exports.default = _default;