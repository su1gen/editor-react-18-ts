"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFeatureFlags = void 0;

var _pluginKey = require("./plugin-key");

var getFeatureFlags = function getFeatureFlags(state) {
  return _pluginKey.pluginKey.getState(state);
};

exports.getFeatureFlags = getFeatureFlags;