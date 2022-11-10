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
export function addAnalytics(state, tr, payload, channel = editorAnalyticsChannel) {
  const createAnalyticsEvent = getCreateUIAnalyticsEvent(state);

  if (!createAnalyticsEvent) {
    return tr;
  }

  attachPayloadIntoTransaction({
    tr,
    editorState: state,
    payload,
    channel
  });
  return tr;
}
export function withAnalytics(payload, channel) {
  return command => (state, dispatch, view) => command(state, tr => {
    if (dispatch) {
      if (payload instanceof Function) {
        const dynamicPayload = payload(state);

        if (dynamicPayload) {
          dispatch(addAnalytics(state, tr, dynamicPayload, channel));
        }
      } else {
        dispatch(addAnalytics(state, tr, payload, channel));
      }
    }
  }, view);
}
export function getAnalyticsEventsFromTransaction(tr) {
  return tr.steps.filter(step => step instanceof AnalyticsStep).reduce((acc, step) => [...acc, ...step.analyticsEvents], []);
}