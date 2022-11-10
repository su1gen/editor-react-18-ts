"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKeyName = exports.pluginKey = void 0;

var _prosemirrorState = require("prosemirror-state");

var pluginKeyName = 'statusPlugin';
exports.pluginKeyName = pluginKeyName;
var pluginKey = new _prosemirrorState.PluginKey('statusPlugin');
exports.pluginKey = pluginKey;