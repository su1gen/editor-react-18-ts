"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _pluginKey = require("./plugin-key");

var createPlugin = function createPlugin(_ref) {
  var dispatch = _ref.dispatch;
  return new _safePlugin.SafePlugin({
    key: _pluginKey.pluginKey
  });
};

exports.createPlugin = createPlugin;