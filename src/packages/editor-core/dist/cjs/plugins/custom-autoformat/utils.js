"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKey = exports.getPluginState = exports.autoformatAction = void 0;

var _prosemirrorState = require("prosemirror-state");

var pluginKey = new _prosemirrorState.PluginKey('customAutoformatPlugin');
exports.pluginKey = pluginKey;

var getPluginState = function getPluginState(editorState) {
  return pluginKey.getState(editorState);
};

exports.getPluginState = getPluginState;

var autoformatAction = function autoformatAction(tr, action) {
  return tr.setMeta(pluginKey, action);
};

exports.autoformatAction = autoformatAction;