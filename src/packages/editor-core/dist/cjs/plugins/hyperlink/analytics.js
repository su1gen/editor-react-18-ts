"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLinkCreationAnalyticsEvent = getLinkCreationAnalyticsEvent;

var _analytics = require("../analytics");

var _utils = require("./utils");

function getLinkCreationAnalyticsEvent(inputMethod, url) {
  return {
    action: _analytics.ACTION.INSERTED,
    actionSubject: _analytics.ACTION_SUBJECT.DOCUMENT,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.LINK,
    attributes: {
      inputMethod: inputMethod,
      fromCurrentDomain: (0, _utils.isFromCurrentDomain)(url)
    },
    eventType: _analytics.EVENT_TYPE.TRACK,
    nonPrivacySafeAttributes: {
      linkDomain: (0, _utils.getLinkDomain)(url)
    }
  };
}