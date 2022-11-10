"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPluginState = exports.createPluginState = exports.createCommand = void 0;

var _pluginStateFactory = require("../../../../utils/plugin-state-factory");

var _pluginKey = require("./plugin-key");

var _reducer = require("./reducer");

var _pluginFactory = (0, _pluginStateFactory.pluginFactory)(_pluginKey.pluginKey, _reducer.reducer),
    createPluginState = _pluginFactory.createPluginState,
    createCommand = _pluginFactory.createCommand,
    getPluginState = _pluginFactory.getPluginState;

exports.getPluginState = getPluginState;
exports.createCommand = createCommand;
exports.createPluginState = createPluginState;