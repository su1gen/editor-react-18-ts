"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getParticipantsCount = getParticipantsCount;

var _pluginKey = require("./plugin-key");

function getParticipantsCount(state) {
  if (!state) {
    return 1;
  }

  var pluginState = _pluginKey.pluginKey.getState(state);

  return pluginState && pluginState.participants ? pluginState.participants.size() : 1;
}