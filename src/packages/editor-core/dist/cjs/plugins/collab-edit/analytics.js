"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addSynchronyErrorAnalytics = exports.addSynchronyEntityAnalytics = void 0;

var _analytics = require("../analytics");

var _featureFlagsContext = require("../feature-flags-context");

var _documentLogger = require("../../utils/document-logger");

var _utils = require("@atlaskit/editor-common/utils");

var addSynchronyErrorAnalytics = function addSynchronyErrorAnalytics(state, tr) {
  return function (error) {
    var browserExtensions = (0, _utils.sniffUserBrowserExtensions)({
      extensions: ['grammarly']
    });
    var payload = {
      action: _analytics.ACTION.SYNCHRONY_ERROR,
      actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
      eventType: _analytics.EVENT_TYPE.OPERATIONAL,
      attributes: {
        error: error,
        browserExtensions: browserExtensions
      }
    };

    if ((0, _featureFlagsContext.getFeatureFlags)(state).synchronyErrorDocStructure) {
      payload.attributes.docStructure = (0, _documentLogger.getDocStructure)(state.doc, {
        compact: true
      });
    }

    return (0, _analytics.addAnalytics)(state, tr, payload);
  };
};

exports.addSynchronyErrorAnalytics = addSynchronyErrorAnalytics;

var addSynchronyEntityAnalytics = function addSynchronyEntityAnalytics(state, tr) {
  return function (type) {
    return (0, _analytics.addAnalytics)(state, tr, {
      action: type === 'error' ? _analytics.ACTION.SYNCHRONY_ENTITY_ERROR : _analytics.ACTION.SYNCHRONY_DISCONNECTED,
      actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
      eventType: _analytics.EVENT_TYPE.OPERATIONAL,
      attributes: {
        // https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
        onLine: navigator.onLine,
        visibilityState: document.visibilityState
      }
    });
  };
};

exports.addSynchronyEntityAnalytics = addSynchronyEntityAnalytics;