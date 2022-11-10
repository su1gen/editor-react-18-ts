"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKey = exports.plugin = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _utils = require("../utils");

var pluginKey = new _prosemirrorState.PluginKey('clearFormattingPlugin');
exports.pluginKey = pluginKey;

var plugin = function plugin(dispatch) {
  return new _safePlugin.SafePlugin({
    state: {
      init: function init(_config, state) {
        return {
          formattingIsPresent: (0, _utils.checkFormattingIsPresent)(state)
        };
      },
      apply: function apply(_tr, pluginState, _oldState, newState) {
        var formattingIsPresent = (0, _utils.checkFormattingIsPresent)(newState);

        if (formattingIsPresent !== pluginState.formattingIsPresent) {
          dispatch(pluginKey, {
            formattingIsPresent: formattingIsPresent
          });
          return {
            formattingIsPresent: formattingIsPresent
          };
        }

        return pluginState;
      }
    },
    key: pluginKey
  });
};

exports.plugin = plugin;