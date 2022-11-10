import { TextSelection } from 'prosemirror-state';
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { ACTION_SUBJECT, ACTION_SUBJECT_ID, EVENT_TYPE, ACTION, INPUT_METHOD } from '../../analytics';
import { addAnalytics } from '../../analytics/utils';
import { getSelectionPositions, getPluginState, getDraftCommandAnalyticsPayload } from '../utils';
import { applyMarkOnRange } from '../../../utils/commands';

var addAnnotationMark = function addAnnotationMark(id) {
  return function (transaction, state) {
    var inlineCommentState = getPluginState(state);

    var _getSelectionPosition = getSelectionPositions(state, inlineCommentState),
        from = _getSelectionPosition.from,
        to = _getSelectionPosition.to,
        head = _getSelectionPosition.head;

    var annotationMark = state.schema.marks.annotation.create({
      id: id,
      type: AnnotationTypes.INLINE_COMMENT
    }); // Apply the mark only to text node in the range.

    var tr = applyMarkOnRange(from, to, false, annotationMark, transaction); // set selection back to the end of annotation once annotation mark is applied

    tr.setSelection(TextSelection.create(tr.doc, head));
    return tr;
  };
};

var addInlineComment = function addInlineComment(id) {
  return function (transaction, state) {
    var tr = addAnnotationMark(id)(transaction, state); // add insert analytics step to transaction

    tr = addInsertAnalytics(tr, state); // add close analytics step to transaction

    tr = addOpenCloseAnalytics(false, INPUT_METHOD.TOOLBAR)(tr, state);
    return tr;
  };
};

var addOpenCloseAnalytics = function addOpenCloseAnalytics(drafting) {
  var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INPUT_METHOD.TOOLBAR;
  return function (transaction, state) {
    var draftingPayload = getDraftCommandAnalyticsPayload(drafting, method)(state);
    return addAnalytics(state, transaction, draftingPayload);
  };
};

var addInsertAnalytics = function addInsertAnalytics(transaction, state) {
  return addAnalytics(state, transaction, {
    action: ACTION.INSERTED,
    actionSubject: ACTION_SUBJECT.ANNOTATION,
    eventType: EVENT_TYPE.TRACK,
    actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT
  });
};

var addResolveAnalytics = function addResolveAnalytics(method) {
  return function (transaction, state) {
    var resolvedPayload = {
      action: ACTION.RESOLVED,
      actionSubject: ACTION_SUBJECT.ANNOTATION,
      actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        method: method
      }
    };
    return addAnalytics(state, transaction, resolvedPayload);
  };
};

export default {
  addAnnotationMark: addAnnotationMark,
  addInlineComment: addInlineComment,
  addOpenCloseAnalytics: addOpenCloseAnalytics,
  addInsertAnalytics: addInsertAnalytics,
  addResolveAnalytics: addResolveAnalytics
};