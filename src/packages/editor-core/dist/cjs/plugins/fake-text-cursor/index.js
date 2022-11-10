"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stateKey = exports.default = exports.createPlugin = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _cursor = require("./cursor");

var stateKey = new _prosemirrorState.PluginKey('fakeTextCursorPlugin');
exports.stateKey = stateKey;

var createPlugin = function createPlugin() {
  return new _safePlugin.SafePlugin({
    key: stateKey,
    props: {
      decorations: _cursor.drawFakeTextCursor
    }
  });
};

exports.createPlugin = createPlugin;

var fakeTextCursorPlugin = function fakeTextCursorPlugin() {
  return {
    name: 'fakeTextCursor',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'fakeTextCursor',
        plugin: function plugin() {
          return createPlugin();
        }
      }];
    }
  };
};

var _default = fakeTextCursorPlugin;
exports.default = _default;