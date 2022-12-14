import { ACTION, ACTION_SUBJECT, EVENT_TYPE, ACTION_SUBJECT_ID, INPUT_METHOD } from '../plugins/analytics';
export var buildEditLinkPayload = function buildEditLinkPayload(type) {
  return {
    action: ACTION.CLICKED,
    actionSubject: type === ACTION_SUBJECT_ID.HYPERLINK ? ACTION_SUBJECT.HYPERLINK : ACTION_SUBJECT.SMART_LINK,
    actionSubjectId: ACTION_SUBJECT_ID.EDIT_LINK,
    attributes: type !== ACTION_SUBJECT_ID.HYPERLINK ? {
      display: type
    } : {},
    eventType: EVENT_TYPE.UI
  };
};

var mapLinkTypeToCardAppearance = function mapLinkTypeToCardAppearance(type) {
  switch (type) {
    case ACTION_SUBJECT_ID.CARD_INLINE:
      {
        return 'inline';
      }

    case ACTION_SUBJECT_ID.CARD_BLOCK:
      {
        return 'block';
      }

    case ACTION_SUBJECT_ID.EMBEDS:
      {
        return 'embed';
      }

    default:
      {
        return 'url';
      }
  }
};

export var buildVisitedLinkPayload = function buildVisitedLinkPayload(type) {
  return type === ACTION_SUBJECT_ID.HYPERLINK ? {
    action: ACTION.VISITED,
    actionSubject: ACTION_SUBJECT.HYPERLINK,
    actionSubjectId: undefined,
    attributes: {
      inputMethod: INPUT_METHOD.TOOLBAR
    },
    eventType: EVENT_TYPE.TRACK
  } : {
    action: ACTION.VISITED,
    actionSubject: ACTION_SUBJECT.SMART_LINK,
    actionSubjectId: type,
    attributes: {
      inputMethod: INPUT_METHOD.TOOLBAR
    },
    eventType: EVENT_TYPE.TRACK
  };
};
export var buildOpenedSettingsPayload = function buildOpenedSettingsPayload(type) {
  return {
    action: ACTION.CLICKED,
    actionSubject: ACTION_SUBJECT.BUTTON,
    actionSubjectId: ACTION_SUBJECT_ID.GOTO_SMART_LINK_SETTINGS,
    attributes: {
      inputMethod: INPUT_METHOD.TOOLBAR,
      display: mapLinkTypeToCardAppearance(type)
    },
    eventType: EVENT_TYPE.UI
  };
};
export var unlinkPayload = function unlinkPayload(type) {
  return {
    action: ACTION.UNLINK,
    actionSubject: type === ACTION_SUBJECT_ID.HYPERLINK ? ACTION_SUBJECT.HYPERLINK : ACTION_SUBJECT.SMART_LINK,
    actionSubjectId: type === ACTION_SUBJECT_ID.HYPERLINK ? undefined : type,
    attributes: {
      inputMethod: INPUT_METHOD.TOOLBAR
    },
    eventType: EVENT_TYPE.TRACK
  };
};