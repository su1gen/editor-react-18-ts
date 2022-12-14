import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE } from '../analytics';
import { getLinkDomain, isFromCurrentDomain } from './utils';
export function getLinkCreationAnalyticsEvent(inputMethod, url) {
  return {
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: ACTION_SUBJECT_ID.LINK,
    attributes: {
      inputMethod: inputMethod,
      fromCurrentDomain: isFromCurrentDomain(url)
    },
    eventType: EVENT_TYPE.TRACK,
    nonPrivacySafeAttributes: {
      linkDomain: getLinkDomain(url)
    }
  };
}