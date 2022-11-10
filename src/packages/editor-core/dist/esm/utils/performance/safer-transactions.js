import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../plugins/analytics';
export var UNSAFE_PROPERTY_SET_ERROR = 'Setting an unsafe property on transaction after dispatch!'; // since selection uses curSelection under the hood, we guard setSelection instead

var isUnsafeMethod = function isUnsafeMethod(prop) {
  return ['setSelection'].includes(prop.toString());
};

var isReadOnlyProperty = function isReadOnlyProperty(prop) {
  return ['doc', 'docs', 'steps', 'selection'].includes(prop.toString());
};

export var freezeUnsafeTransactionProperties = function freezeUnsafeTransactionProperties(_ref) {
  var dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent,
      pluginKey = _ref.pluginKey;

  var isUnsafe = function isUnsafe() {
    if (dispatchAnalyticsEvent) {
      dispatchAnalyticsEvent({
        action: ACTION.TRANSACTION_MUTATED_AFTER_DISPATCH,
        actionSubject: ACTION_SUBJECT.EDITOR,
        eventType: EVENT_TYPE.OPERATIONAL,
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