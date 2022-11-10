"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _analytics = require("../../analytics");

var hasInvalidSteps = function hasInvalidSteps(tr) {
  return (tr.steps || []).some(function (step) {
    return step.from > step.to;
  });
};

var _default = function _default(dispatchAnalyticsEvent) {
  return new _safePlugin.SafePlugin({
    filterTransaction: function filterTransaction(transaction) {
      if (hasInvalidSteps(transaction)) {
        // eslint-disable-next-line no-console
        console.warn('The transaction was blocked because it contains invalid steps', transaction.steps);
        dispatchAnalyticsEvent({
          action: _analytics.ACTION.DISCARDED_INVALID_STEPS_FROM_TRANSACTION,
          actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
          attributes: {
            analyticsEventPayloads: (0, _analytics.getAnalyticsEventsFromTransaction)(transaction)
          },
          eventType: _analytics.EVENT_TYPE.OPERATIONAL
        });
        return false;
      }

      return true;
    }
  });
};

exports.default = _default;