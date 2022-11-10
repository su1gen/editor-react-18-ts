"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unlinkPayload = exports.buildVisitedLinkPayload = exports.buildOpenedSettingsPayload = exports.buildEditLinkPayload = void 0;

var _analytics = require("../plugins/analytics");

var buildEditLinkPayload = function buildEditLinkPayload(type) {
  return {
    action: _analytics.ACTION.CLICKED,
    actionSubject: type === _analytics.ACTION_SUBJECT_ID.HYPERLINK ? _analytics.ACTION_SUBJECT.HYPERLINK : _analytics.ACTION_SUBJECT.SMART_LINK,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.EDIT_LINK,
    attributes: type !== _analytics.ACTION_SUBJECT_ID.HYPERLINK ? {
      display: type
    } : {},
    eventType: _analytics.EVENT_TYPE.UI
  };
};

exports.buildEditLinkPayload = buildEditLinkPayload;

var mapLinkTypeToCardAppearance = function mapLinkTypeToCardAppearance(type) {
  switch (type) {
    case _analytics.ACTION_SUBJECT_ID.CARD_INLINE:
      {
        return 'inline';
      }

    case _analytics.ACTION_SUBJECT_ID.CARD_BLOCK:
      {
        return 'block';
      }

    case _analytics.ACTION_SUBJECT_ID.EMBEDS:
      {
        return 'embed';
      }

    default:
      {
        return 'url';
      }
  }
};

var buildVisitedLinkPayload = function buildVisitedLinkPayload(type) {
  return type === _analytics.ACTION_SUBJECT_ID.HYPERLINK ? {
    action: _analytics.ACTION.VISITED,
    actionSubject: _analytics.ACTION_SUBJECT.HYPERLINK,
    actionSubjectId: undefined,
    attributes: {
      inputMethod: _analytics.INPUT_METHOD.TOOLBAR
    },
    eventType: _analytics.EVENT_TYPE.TRACK
  } : {
    action: _analytics.ACTION.VISITED,
    actionSubject: _analytics.ACTION_SUBJECT.SMART_LINK,
    actionSubjectId: type,
    attributes: {
      inputMethod: _analytics.INPUT_METHOD.TOOLBAR
    },
    eventType: _analytics.EVENT_TYPE.TRACK
  };
};

exports.buildVisitedLinkPayload = buildVisitedLinkPayload;

var buildOpenedSettingsPayload = function buildOpenedSettingsPayload(type) {
  return {
    action: _analytics.ACTION.CLICKED,
    actionSubject: _analytics.ACTION_SUBJECT.BUTTON,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.GOTO_SMART_LINK_SETTINGS,
    attributes: {
      inputMethod: _analytics.INPUT_METHOD.TOOLBAR,
      display: mapLinkTypeToCardAppearance(type)
    },
    eventType: _analytics.EVENT_TYPE.UI
  };
};

exports.buildOpenedSettingsPayload = buildOpenedSettingsPayload;

var unlinkPayload = function unlinkPayload(type) {
  return {
    action: _analytics.ACTION.UNLINK,
    actionSubject: type === _analytics.ACTION_SUBJECT_ID.HYPERLINK ? _analytics.ACTION_SUBJECT.HYPERLINK : _analytics.ACTION_SUBJECT.SMART_LINK,
    actionSubjectId: type === _analytics.ACTION_SUBJECT_ID.HYPERLINK ? undefined : type,
    attributes: {
      inputMethod: _analytics.INPUT_METHOD.TOOLBAR
    },
    eventType: _analytics.EVENT_TYPE.TRACK
  };
};

exports.unlinkPayload = unlinkPayload;