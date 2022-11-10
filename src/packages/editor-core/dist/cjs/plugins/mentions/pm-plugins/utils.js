"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMentionPluginState = getMentionPluginState;

var _key = require("./key");

function getMentionPluginState(state) {
  return _key.mentionPluginKey.getState(state);
}