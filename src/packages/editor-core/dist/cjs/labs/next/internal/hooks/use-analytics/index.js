"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnalyticsHandler = useAnalyticsHandler;
exports.useCreateAnalyticsHandler = useCreateAnalyticsHandler;

var _react = _interopRequireDefault(require("react"));

var _analytics = require("../../../../../plugins/analytics");

var _consts = require("../../../../../plugins/analytics/consts");

/**
 * Subscribes to analytics events fired from editor components
 * and passes them through to `fireAnalyticsEvent`.
 */
function useAnalyticsHandler(editorSharedConfig) {
  // handleAnalyticsEvent – must always be the same so we can unsubscribe from events properly.
  var handleAnalyticsEvent = _react.default.useCallback(function (payload) {
    var handleAnalyticsEvent = editorSharedConfig && editorSharedConfig.dispatchAnalyticsEvent;

    if (!handleAnalyticsEvent) {
      return;
    }

    handleAnalyticsEvent(payload);
  }, [editorSharedConfig]);

  if (editorSharedConfig) {
    editorSharedConfig.eventDispatcher.on(_consts.analyticsEventKey, handleAnalyticsEvent);
  }

  _react.default.useEffect(function () {
    return function () {
      if (!editorSharedConfig || !editorSharedConfig.eventDispatcher) {
        return;
      }

      editorSharedConfig.eventDispatcher.off(_consts.analyticsEventKey, handleAnalyticsEvent);
    };
  }, [editorSharedConfig, handleAnalyticsEvent]);
}

function useCreateAnalyticsHandler(createAnalyticsEvent) {
  // AFP-2511 TODO: Fix automatic suppressions below
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return _react.default.useCallback((0, _analytics.fireAnalyticsEvent)(createAnalyticsEvent), [createAnalyticsEvent]);
}