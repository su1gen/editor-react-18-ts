"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKey = exports.getPluginState = exports.createPluginState = exports.createCommand = void 0;

var _prosemirrorState = require("prosemirror-state");

var _pluginStateFactory = require("../../../utils/plugin-state-factory");

var _reducer = _interopRequireDefault(require("../reducer"));

var pluginKey = new _prosemirrorState.PluginKey('expandPlugin');
exports.pluginKey = pluginKey;

var _pluginFactory = (0, _pluginStateFactory.pluginFactory)(pluginKey, _reducer.default),
    createPluginState = _pluginFactory.createPluginState,
    createCommand = _pluginFactory.createCommand,
    getPluginState = _pluginFactory.getPluginState;

exports.getPluginState = getPluginState;
exports.createCommand = createCommand;
exports.createPluginState = createPluginState;