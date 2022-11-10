import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import { AnalyticsStep } from '@atlaskit/adf-schema/steps';
import { editorAnalyticsChannel } from './consts';
import { analyticsPluginKey } from './plugin-key';

function getCreateUIAnalyticsEvent(editorState) {
  var _analyticsPluginKey$g;

  return (_analyticsPluginKey$g = analyticsPluginKey.getState(editorState)) === null || _analyticsPluginKey$g === void 0 ? void 0 : _analyticsPluginKey$g.createAnalyticsEvent;
}

import { attachPayloadIntoTransaction } from '../../analytics-api/attach-payload-into-transaction';
import { mapActionSubjectIdToAttributes } from '../../analytics-api/map-attributes';
import { getStateContext, getSelectionType, findInsertLocation } from '../../analytics-api/editor-state-context';
export { getStateContext, mapActionSubjectIdToAttributes, getSelectionType, findInsertLocation };
export function addAnalytics(state, tr, payload) {
  var channel = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : editorAnalyticsChannel;
  var createAnalyticsEvent = getCreateUIAnalyticsEvent(state);

  if (!createAnalyticsEvent) {
    return tr;
  }

  attachPayloadIntoTransaction({
    tr: tr,
    editorState: state,
    payload: payload,
    channel: channel
  });
  return tr;
}
export function withAnalytics(payload, channel) {
  return function (command) {
    return function (state, dispatch, view) {
      return command(state, function (tr) {
        if (dispatch) {
          if (payload instanceof Function) {
            var dynamicPayload = payload(state);

            if (dynamicPayload) {
              dispatch(addAnalytics(state, tr, dynamicPayload, channel));
            }
          } else {
            dispatch(addAnalytics(state, tr, payload, channel));
          }
        }
      }, view);
    };
  };
}
export function getAnalyticsEventsFromTransaction(tr) {
  return tr.steps.filter(function (step) {
    return step instanceof AnalyticsStep;
  }).reduce(function (acc, step) {
    return [].concat(_toConsumableArray(acc), _toConsumableArray(step.analyticsEvents));
  }, []);
}