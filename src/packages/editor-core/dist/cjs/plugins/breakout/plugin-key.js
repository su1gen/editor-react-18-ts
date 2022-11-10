"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKey = exports.getPluginState = void 0;

var _prosemirrorState = require("prosemirror-state");

var pluginKey = new _prosemirrorState.PluginKey('breakoutPlugin');
exports.pluginKey = pluginKey;

var getPluginState = function getPluginState(state) {
  return pluginKey.getState(state);
};

exports.getPluginState = getPluginState;