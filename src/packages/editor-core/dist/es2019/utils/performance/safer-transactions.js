import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../plugins/analytics';
export const UNSAFE_PROPERTY_SET_ERROR = 'Setting an unsafe property on transaction after dispatch!'; // since selection uses curSelection under the hood, we guard setSelection instead

const isUnsafeMethod = prop => ['setSelection'].includes(prop.toString());

const isReadOnlyProperty = prop => ['doc', 'docs', 'steps', 'selection'].includes(prop.toString());

export const freezeUnsafeTransactionProperties = ({
  dispatchAnalyticsEvent,
  pluginKey
}) => {
  const isUnsafe = () => {
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
    get: function (target, prop, receiver) {
      if (isUnsafeMethod(prop)) {
        isUnsafe();
      }

      return Reflect.get(target, prop, receiver);
    },
    set: function (target, prop, receiver) {
      if (isReadOnlyProperty(prop)) {
        isUnsafe();
      }

      return Reflect.set(target, prop, receiver);
    }
  };
};