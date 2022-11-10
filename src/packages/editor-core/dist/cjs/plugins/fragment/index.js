"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = createPlugin;
exports.default = void 0;

var _adfSchema = require("@atlaskit/adf-schema");

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _pluginKey = require("./plugin-key");

var _fragmentConsistency = require("./pm-plugins/fragment-consistency");

function createPlugin() {
  return new _safePlugin.SafePlugin({
    key: _pluginKey.pluginKey
  });
}

var fragmentMarkPlugin = function fragmentMarkPlugin() {
  return {
    name: 'fragmentPlugin',
    marks: function marks() {
      return [{
        name: 'fragment',
        mark: _adfSchema.fragment
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'fragmentMarkConsistency',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return (0, _fragmentConsistency.createPlugin)(dispatch);
        }
      }];
    }
  };
};

var _default = fragmentMarkPlugin;
exports.default = _default;