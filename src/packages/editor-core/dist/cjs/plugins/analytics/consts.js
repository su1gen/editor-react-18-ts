"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editorAnalyticsChannel = exports.analyticsEventKey = void 0;

var _analyticsListeners = require("@atlaskit/analytics-listeners");

var _utils = require("@atlaskit/editor-common/utils");

var analyticsEventKey = _utils.analyticsEventKey;
exports.analyticsEventKey = analyticsEventKey;
var editorAnalyticsChannel = _analyticsListeners.FabricChannel.editor;
exports.editorAnalyticsChannel = editorAnalyticsChannel;