"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPmHistoryPluginState = exports.getPmHistoryPlugin = void 0;

var _pmHistoryTypes = require("./pm-history-types");

var getPmHistoryPlugin = function getPmHistoryPlugin(state) {
  return state.plugins.find(function (plugin) {
    return plugin.key === _pmHistoryTypes.pmHistoryPluginKey;
  });
};

exports.getPmHistoryPlugin = getPmHistoryPlugin;

var getPmHistoryPluginState = function getPmHistoryPluginState(state) {
  var pmHistoryPlugin = getPmHistoryPlugin(state);

  if (!pmHistoryPlugin) {
    return;
  }

  return pmHistoryPlugin.getState(state);
};

exports.getPmHistoryPluginState = getPmHistoryPluginState;