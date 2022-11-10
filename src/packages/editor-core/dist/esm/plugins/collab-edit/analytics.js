import { addAnalytics, ACTION, EVENT_TYPE, ACTION_SUBJECT } from '../analytics';
import { getFeatureFlags } from '../feature-flags-context';
import { getDocStructure } from '../../utils/document-logger';
import { sniffUserBrowserExtensions } from '@atlaskit/editor-common/utils';
export var addSynchronyErrorAnalytics = function addSynchronyErrorAnalytics(state, tr) {
  return function (error) {
    var browserExtensions = sniffUserBrowserExtensions({
      extensions: ['grammarly']
    });
    var payload = {
      action: ACTION.SYNCHRONY_ERROR,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        error: error,
        browserExtensions: browserExtensions
      }
    };

    if (getFeatureFlags(state).synchronyErrorDocStructure) {
      payload.attributes.docStructure = getDocStructure(state.doc, {
        compact: true
      });
    }

    return addAnalytics(state, tr, payload);
  };
};
export var addSynchronyEntityAnalytics = function addSynchronyEntityAnalytics(state, tr) {
  return function (type) {
    return addAnalytics(state, tr, {
      action: type === 'error' ? ACTION.SYNCHRONY_ENTITY_ERROR : ACTION.SYNCHRONY_DISCONNECTED,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        // https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine
        onLine: navigator.onLine,
        visibilityState: document.visibilityState
      }
    });
  };
};