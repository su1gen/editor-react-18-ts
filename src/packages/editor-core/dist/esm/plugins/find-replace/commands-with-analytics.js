import { TextSelection } from 'prosemirror-state';
import { withAnalytics, ACTION, ACTION_SUBJECT, EVENT_TYPE, INPUT_METHOD } from '../analytics';
import { activate, find, findNext, findPrevious, replace, replaceAll, cancelSearch } from './commands';
export var activateWithAnalytics = function activateWithAnalytics(_ref) {
  var triggerMethod = _ref.triggerMethod;
  return withAnalytics(function (state) {
    return {
      eventType: EVENT_TYPE.UI,
      action: ACTION.ACTIVATED,
      actionSubject: ACTION_SUBJECT.FIND_REPLACE_DIALOG,
      attributes: {
        inputMethod: state.selection instanceof TextSelection && !state.selection.empty ? INPUT_METHOD.PREFILL : INPUT_METHOD.KEYBOARD,
        triggerMethod: triggerMethod
      }
    };
  })(activate());
};
export var findWithAnalytics = function findWithAnalytics(_ref2) {
  var editorView = _ref2.editorView,
      containerElement = _ref2.containerElement,
      keyword = _ref2.keyword;
  return withAnalytics({
    eventType: EVENT_TYPE.TRACK,
    action: ACTION.FIND_PERFORMED,
    actionSubject: ACTION_SUBJECT.TEXT
  })(find(editorView, containerElement, keyword));
};
export var findNextWithAnalytics = function findNextWithAnalytics(_ref3) {
  var triggerMethod = _ref3.triggerMethod;
  return withAnalytics({
    eventType: EVENT_TYPE.TRACK,
    action: ACTION.FIND_NEXT_PERFORMED,
    actionSubject: ACTION_SUBJECT.TEXT,
    attributes: {
      triggerMethod: triggerMethod
    }
  })(findNext());
};
export var findPrevWithAnalytics = function findPrevWithAnalytics(_ref4) {
  var triggerMethod = _ref4.triggerMethod;
  return withAnalytics({
    eventType: EVENT_TYPE.TRACK,
    action: ACTION.FIND_PREV_PERFORMED,
    actionSubject: ACTION_SUBJECT.TEXT,
    attributes: {
      triggerMethod: triggerMethod
    }
  })(findPrevious());
};
export var replaceWithAnalytics = function replaceWithAnalytics(_ref5) {
  var triggerMethod = _ref5.triggerMethod,
      replaceText = _ref5.replaceText;
  return withAnalytics({
    eventType: EVENT_TYPE.TRACK,
    action: ACTION.REPLACED_ONE,
    actionSubject: ACTION_SUBJECT.TEXT,
    attributes: {
      triggerMethod: triggerMethod
    }
  })(replace(replaceText));
};
export var replaceAllWithAnalytics = function replaceAllWithAnalytics(_ref6) {
  var replaceText = _ref6.replaceText;
  return withAnalytics({
    eventType: EVENT_TYPE.TRACK,
    action: ACTION.REPLACED_ALL,
    actionSubject: ACTION_SUBJECT.TEXT
  })(replaceAll(replaceText));
};
export var cancelSearchWithAnalytics = function cancelSearchWithAnalytics(_ref7) {
  var triggerMethod = _ref7.triggerMethod;
  return withAnalytics({
    eventType: EVENT_TYPE.UI,
    action: ACTION.DEACTIVATED,
    actionSubject: ACTION_SUBJECT.FIND_REPLACE_DIALOG,
    attributes: {
      triggerMethod: triggerMethod
    }
  })(cancelSearch());
};