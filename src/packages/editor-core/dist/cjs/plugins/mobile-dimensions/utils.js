"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMobileDimensionsPluginState = void 0;

var _pluginFactory = require("./plugin-factory");

var getMobileDimensionsPluginState = function getMobileDimensionsPluginState(state) {
  return _pluginFactory.mobileDimensionsPluginKey.getState(state);
};

exports.getMobileDimensionsPluginState = getMobileDimensionsPluginState;