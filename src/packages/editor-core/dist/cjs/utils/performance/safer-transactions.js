"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.freezeUnsafeTransactionProperties = exports.UNSAFE_PROPERTY_SET_ERROR = void 0;

var _analytics = require("../../plugins/analytics");

var UNSAFE_PROPERTY_SET_ERROR = 'Setting an unsafe property on transaction after dispatch!'; // since selection uses curSelection under the hood, we guard setSelection instead

exports.UNSAFE_PROPERTY_SET_ERROR = UNSAFE_PROPERTY_SET_ERROR;

var isUnsafeMethod = function isUnsafeMethod(prop) {
  return ['setSelection'].includes(prop.toString());
};

var isReadOnlyProperty = function isReadOnlyProperty(prop) {
  return ['doc', 'docs', 'steps', 'selection'].includes(prop.toString());
};

var freezeUnsafeTransactionProperties = function freezeUnsafeTransactionProperties(_ref) {
  var dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent,
      pluginKey = _ref.pluginKey;

  var isUnsafe = function isUnsafe() {
    if (dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: _analytics.ACTION.TRANSACTION_MUTATED_AFTER_DISPATCH,
        actionSubject: _analytics.ACTION_SUBJECT.EDITOR,
        eventType: _analytics.EVENT_TYPE.OPERATIONAL,
        attributes: {
          pluginKey: pluginKey || 'unknown'
        }
      });
    }

    throw new Error(UNSAFE_PROPERTY_SET_ERROR);
  };

  return {
    get: function get(target, prop, receiver) {
      if (isUnsafeMethod(prop)) {
        isUnsafe();
      }

      return Reflect.get(target, prop, receiver);
    },
    set: function set(target, prop, receiver) {
      if (isReadOnlyProperty(prop)) {
        isUnsafe();
      }

      return Reflect.set(target, prop, receiver);
    }
  };
};

exports.freezeUnsafeTransactionProperties = freezeUnsafeTransactionProperties;