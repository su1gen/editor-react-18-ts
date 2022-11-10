import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { createCommand } from '.';
import { isSelectionMediaSingleNode, getMediaNodeFromSelection } from '../../utils/media-common';
import { ACTION_SUBJECT, EVENT_TYPE, withAnalytics, ACTION_SUBJECT_ID, ACTION } from '../../../analytics';

var createCommandWithAnalytics = function createCommandWithAnalytics(actionType, action, transform) {
  return withAnalytics({
    action: actionType,
    actionSubject: ACTION_SUBJECT.MEDIA,
    actionSubjectId: ACTION_SUBJECT_ID.ALT_TEXT,
    eventType: EVENT_TYPE.TRACK
  })(createCommand(action, transform));
};

export var closeMediaAltTextMenu = createCommand(function (state) {
  if (isSelectionMediaSingleNode(state)) {
    return {
      type: 'closeMediaAltTextMenu'
    };
  }

  return false;
});
export var openMediaAltTextMenu = createCommandWithAnalytics(ACTION.OPENED, function (state) {
  if (isSelectionMediaSingleNode(state)) {
    return {
      type: 'openMediaAltTextMenu'
    };
  }

  return false;
}, function (tr) {
  return tr.setMeta('scrollIntoView', false);
});
export var updateAltText = function updateAltText(newAltText) {
  return createCommand(function (state) {
    return isSelectionMediaSingleNode(state) ? {
      type: 'updateAltText'
    } : false;
  }, function (tr, state) {
    var mediaNode = getMediaNodeFromSelection(state);
    var pos = tr.selection.from + 1;

    if (mediaNode) {
      tr.setMeta('scrollIntoView', false);
      tr.setNodeMarkup(pos, undefined, _objectSpread(_objectSpread({}, mediaNode.attrs), {}, {
        alt: newAltText
      }));
    }

    return tr;
  });
};