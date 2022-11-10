"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _pluginKey = require("./plugin-key");

var _pluginFactory = require("./plugin-factory");

var createPlugin = function createPlugin(dispatch) {
  return new _safePlugin.SafePlugin({
    state: (0, _pluginFactory.createPluginState)(dispatch, {}),
    key: _pluginKey.pluginKey
  });
};

exports.createPlugin = createPlugin;