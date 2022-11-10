"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _prosemirrorState = require("prosemirror-state");

var _adfSchema = require("@atlaskit/adf-schema");

var _analytics = require("../../analytics");

var _utils = require("../../analytics/utils");

var _utils2 = require("../utils");

var _commands = require("../../../utils/commands");

var addAnnotationMark = function addAnnotationMark(id) {
  return function (transaction, state) {
    var inlineCommentState = (0, _utils2.getPluginState)(state);

    var _getSelectionPosition = (0, _utils2.getSelectionPositions)(state, inlineCommentState),
        from = _getSelectionPosition.from,
        to = _getSelectionPosition.to,
        head = _getSelectionPosition.head;

    var annotationMark = state.schema.marks.annotation.create({
      id: id,
      type: _adfSchema.AnnotationTypes.INLINE_COMMENT
    }); // Apply the mark only to text node in the range.

    var tr = (0, _commands.applyMarkOnRange)(from, to, false, annotationMark, transaction); // set selection back to the end of annotation once annotation mark is applied

    tr.setSelection(_prosemirrorState.TextSelection.create(tr.doc, head));
    return tr;
  };
};

var addInlineComment = function addInlineComment(id) {
  return function (transaction, state) {
    var tr = addAnnotationMark(id)(transaction, state); // add insert analytics step to transaction

    tr = addInsertAnalytics(tr, state); // add close analytics step to transaction

    tr = addOpenCloseAnalytics(false, _analytics.INPUT_METHOD.TOOLBAR)(tr, state);
    return tr;
  };
};

var addOpenCloseAnalytics = function addOpenCloseAnalytics(drafting) {
  var method = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _analytics.INPUT_METHOD.TOOLBAR;
  return function (transaction, state) {
    var draftingPayload = (0, _utils2.getDraftCommandAnalyticsPayload)(drafting, method)(state);
    return (0, _utils.addAnalytics)(state, transaction, draftingPayload);
  };
};

var addInsertAnalytics = function addInsertAnalytics(transaction, state) {
  return (0, _utils.addAnalytics)(state, transaction, {
    action: _analytics.ACTION.INSERTED,
    actionSubject: _analytics.ACTION_SUBJECT.ANNOTATION,
    eventType: _analytics.EVENT_TYPE.TRACK,
    actionSubjectId: _analytics.ACTION_SUBJECT_ID.INLINE_COMMENT
  });
};

var addResolveAnalytics = function addResolveAnalytics(method) {
  return function (transaction, state) {
    var resolvedPayload = {
      action: _analytics.ACTION.RESOLVED,
      actionSubject: _analytics.ACTION_SUBJECT.ANNOTATION,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.INLINE_COMMENT,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: {
        method: method
      }
    };
    return (0, _utils.addAnalytics)(state, transaction, resolvedPayload);
  };
};

var _default = {
  addAnnotationMark: addAnnotationMark,
  addInlineComment: addInlineComment,
  addOpenCloseAnalytics: addOpenCloseAnalytics,
  addInsertAnalytics: addInsertAnalytics,
  addResolveAnalytics: addResolveAnalytics
};
exports.default = _default;