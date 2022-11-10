import { ruleWithAnalytics, createWrappingJoinRule } from '../../../../utils/input-rules';
import { ACTION, ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, INPUT_METHOD } from '../../../analytics';
export function createRuleForListType(_ref) {
  var listType = _ref.listType,
      expression = _ref.expression;
  var isBulletList = listType.name === 'bulletList';
  var actionSubjectId = isBulletList ? ACTION_SUBJECT_ID.FORMAT_LIST_BULLET : ACTION_SUBJECT_ID.FORMAT_LIST_NUMBER;
  var analyticsPayload = {
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.LIST,
    actionSubjectId: actionSubjectId,
    eventType: EVENT_TYPE.TRACK,
    attributes: {
      inputMethod: INPUT_METHOD.FORMATTING
    }
  };

  var shouldJoinNextNodeWhen = function shouldJoinNextNodeWhen(_, node) {
    return node.type === listType;
  };

  var inputRule = createWrappingJoinRule({
    match: expression,
    nodeType: listType,
    getAttrs: {},
    joinPredicate: shouldJoinNextNodeWhen
  });
  return ruleWithAnalytics(analyticsPayload)(inputRule);
}