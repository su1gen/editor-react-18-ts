"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createRuleForListType = createRuleForListType;

var _inputRules = require("../../../../utils/input-rules");

var _analytics = require("../../../analytics");

function createRuleForListType(_ref) {
  var listType = _ref.listType,
      expression = _ref.expression;
  var isBulletList = listType.name === 'bulletList';
  var actionSubjectId = isBulletList ? _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_BULLET : _analytics.ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
  var analyticsPayload = {
    action: _analytics.ACTION.INSERTED,
    actionSubject: _analytics.ACTION_SUBJECT.LIST,
    actionSubjectId: actionSubjectId,
    eventType: _analytics.EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: _analytics.INPUT_METHOD.FORMATTING
    }
  };

  var shouldJoinNextNodeWhen = function shouldJoinNextNodeWhen(_, node) {
    return node.type === listType;
  };

  var inputRule = (0, _inputRules.createWrappingJoinRule)({
    match: expression,
    nodeType: listType,
    getAttrs: {},
    joinPredicate: shouldJoinNextNodeWhen
  });
  return (0, _inputRules.ruleWithAnalytics)(analyticsPayload)(inputRule);
}