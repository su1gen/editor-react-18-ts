"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mobileDimensionsPluginKey = exports.getPluginState = exports.createPluginState = exports.createCommand = void 0;

var _prosemirrorState = require("prosemirror-state");

var _pluginStateFactory = require("../../utils/plugin-state-factory");

var _reducer = _interopRequireDefault(require("./reducer"));

var mobileDimensionsPluginKey = new _prosemirrorState.PluginKey('mobileDimensions');
exports.mobileDimensionsPluginKey = mobileDimensionsPluginKey;

var _pluginFactory = (0, _pluginStateFactory.pluginFactory)(mobileDimensionsPluginKey, _reducer.default),
    createPluginState = _pluginFactory.createPluginState,
    getPluginState = _pluginFactory.getPluginState,
    createCommand = _pluginFactory.createCommand;

exports.createCommand = createCommand;
exports.getPluginState = getPluginState;
exports.createPluginState = createPluginState;