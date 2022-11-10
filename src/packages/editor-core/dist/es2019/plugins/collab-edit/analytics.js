import { addAnalytics, ACTION, EVENT_TYPE, ACTION_SUBJECT } from '../analytics';
import { getFeatureFlags } from '../feature-flags-context';
import { getDocStructure } from '../../utils/document-logger';
import { sniffUserBrowserExtensions } from '@atlaskit/editor-common/utils';
export const addSynchronyErrorAnalytics = (state, tr) => {
  return error => {
    const browserExtensions = sniffUserBrowserExtensions({
      extensions: ['grammarly']
    });
    const payload = {
      action: ACTION.SYNCHRONY_ERROR,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        error,
        browserExtensions
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
export const addSynchronyEntityAnalytics = (state, tr) => {
  return type => addAnalytics(state, tr, {
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