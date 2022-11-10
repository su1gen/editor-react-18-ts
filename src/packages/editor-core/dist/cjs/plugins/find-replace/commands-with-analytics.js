"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.replaceWithAnalytics = exports.replaceAllWithAnalytics = exports.findWithAnalytics = exports.findPrevWithAnalytics = exports.findNextWithAnalytics = exports.cancelSearchWithAnalytics = exports.activateWithAnalytics = void 0;

var _prosemirrorState = require("prosemirror-state");

var _analytics = require("../analytics");

var _commands = require("./commands");

var activateWithAnalytics = function activateWithAnalytics(_ref) {
  var triggerMethod = _ref.triggerMethod;
  return (0, _analytics.withAnalytics)(function (state) {
    return {
      eventType: _analytics.EVENT_TYPE.UI,
      action: _analytics.ACTION.ACTIVATED,
      actionSubject: _analytics.ACTION_SUBJECT.FIND_REPLACE_DIALOG,
      attributes: {
        inputMethod: state.selection instanceof _prosemirrorState.TextSelection && !state.selection.empty ? _analytics.INPUT_METHOD.PREFILL : _analytics.INPUT_METHOD.KEYBOARD,
        triggerMethod: triggerMethod
      }
    };
  })((0, _commands.activate)());
};

exports.activateWithAnalytics = activateWithAnalytics;

var findWithAnalytics = function findWithAnalytics(_ref2) {
  var editorView = _ref2.editorView,
      containerElement = _ref2.containerElement,
      keyword = _ref2.keyword;
  return (0, _analytics.withAnalytics)({
    eventType: _analytics.EVENT_TYPE.TRACK,
    action: _analytics.ACTION.FIND_PERFORMED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT
  })((0, _commands.find)(editorView, containerElement, keyword));
};

exports.findWithAnalytics = findWithAnalytics;

var findNextWithAnalytics = function findNextWithAnalytics(_ref3) {
  var triggerMethod = _ref3.triggerMethod;
  return (0, _analytics.withAnalytics)({
    eventType: _analytics.EVENT_TYPE.TRACK,
    action: _analytics.ACTION.FIND_NEXT_PERFORMED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    attributes: {
      triggerMethod: triggerMethod
    }
  })((0, _commands.findNext)());
};

exports.findNextWithAnalytics = findNextWithAnalytics;

var findPrevWithAnalytics = function findPrevWithAnalytics(_ref4) {
  var triggerMethod = _ref4.triggerMethod;
  return (0, _analytics.withAnalytics)({
    eventType: _analytics.EVENT_TYPE.TRACK,
    action: _analytics.ACTION.FIND_PREV_PERFORMED,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    attributes: {
      triggerMethod: triggerMethod
    }
  })((0, _commands.findPrevious)());
};

exports.findPrevWithAnalytics = findPrevWithAnalytics;

var replaceWithAnalytics = function replaceWithAnalytics(_ref5) {
  var triggerMethod = _ref5.triggerMethod,
      replaceText = _ref5.replaceText;
  return (0, _analytics.withAnalytics)({
    eventType: _analytics.EVENT_TYPE.TRACK,
    action: _analytics.ACTION.REPLACED_ONE,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT,
    attributes: {
      triggerMethod: triggerMethod
    }
  })((0, _commands.replace)(replaceText));
};

exports.replaceWithAnalytics = replaceWithAnalytics;

var replaceAllWithAnalytics = function replaceAllWithAnalytics(_ref6) {
  var replaceText = _ref6.replaceText;
  return (0, _analytics.withAnalytics)({
    eventType: _analytics.EVENT_TYPE.TRACK,
    action: _analytics.ACTION.REPLACED_ALL,
    actionSubject: _analytics.ACTION_SUBJECT.TEXT
  })((0, _commands.replaceAll)(replaceText));
};

exports.replaceAllWithAnalytics = replaceAllWithAnalytics;

var cancelSearchWithAnalytics = function cancelSearchWithAnalytics(_ref7) {
  var triggerMethod = _ref7.triggerMethod;
  return (0, _analytics.withAnalytics)({
    eventType: _analytics.EVENT_TYPE.UI,
    action: _analytics.ACTION.DEACTIVATED,
    actionSubject: _analytics.ACTION_SUBJECT.FIND_REPLACE_DIALOG,
    attributes: {
      triggerMethod: triggerMethod
    }
  })((0, _commands.cancelSearch)());
};

exports.cancelSearchWithAnalytics = cancelSearchWithAnalytics;