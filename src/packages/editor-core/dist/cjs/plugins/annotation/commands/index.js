"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateMouseState = exports.updateInlineCommentResolvedState = exports.setInlineCommentsVisibility = exports.setInlineCommentDraftState = exports.removeInlineCommentNearSelection = exports.createAnnotation = exports.closeComponent = exports.clearDirtyMark = exports.addInlineComment = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _adfSchema = require("@atlaskit/adf-schema");

var _pluginFactory = require("../pm-plugins/plugin-factory");

var _analytics = require("../../analytics");

var _utils = require("../utils");

var _types = require("../pm-plugins/types");

var _transform = _interopRequireDefault(require("./transform"));

var _types2 = require("../types");

var updateInlineCommentResolvedState = function updateInlineCommentResolvedState(partialNewState, resolveMethod) {
  var command = {
    type: _types.ACTIONS.UPDATE_INLINE_COMMENT_STATE,
    data: partialNewState
  };
  var allResolved = Object.values(partialNewState).every(function (state) {
    return state;
  });

  if (resolveMethod && allResolved) {
    return (0, _pluginFactory.createCommand)(command, _transform.default.addResolveAnalytics(resolveMethod));
  }

  return (0, _pluginFactory.createCommand)(command);
};

exports.updateInlineCommentResolvedState = updateInlineCommentResolvedState;

var closeComponent = function closeComponent() {
  return (0, _pluginFactory.createCommand)({
    type: _types.ACTIONS.CLOSE_COMPONENT
  });
};

exports.closeComponent = closeComponent;

var clearDirtyMark = function clearDirtyMark() {
  return (0, _pluginFactory.createCommand)({
    type: _types.ACTIONS.INLINE_COMMENT_CLEAR_DIRTY_MARK
  });
};

exports.clearDirtyMark = clearDirtyMark;

var removeInlineCommentNearSelection = function removeInlineCommentNearSelection(id) {
  return function (state, dispatch) {
    var tr = state.tr,
        $from = state.selection.$from;
    var annotationMarkType = state.schema.marks.annotation;
    var hasAnnotation = $from.marks().some(function (mark) {
      return mark.type === annotationMarkType;
    });

    if (!hasAnnotation) {
      return false;
    } // just remove entire mark from around the node


    tr.removeMark($from.start(), $from.end(), annotationMarkType.create({
      id: id,
      type: _adfSchema.AnnotationTypes.INLINE_COMMENT
    }));

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};

exports.removeInlineCommentNearSelection = removeInlineCommentNearSelection;

var getDraftCommandAction = function getDraftCommandAction(drafting) {
  return function (editorState) {
    // validate selection only when entering draft mode
    if (drafting && (0, _utils.isSelectionValid)(editorState) !== _types2.AnnotationSelectionType.VALID) {
      return false;
    }

    return {
      type: _types.ACTIONS.SET_INLINE_COMMENT_DRAFT_STATE,
      data: {
        drafting: drafting,
        editorState: editorState
      }
    };
  };
};

var setInlineCommentDraftState = function setInlineCommentDraftState(drafting) {
  var inputMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _analytics.INPUT_METHOD.TOOLBAR;
  var commandAction = getDraftCommandAction(drafting);
  return (0, _pluginFactory.createCommand)(commandAction, _transform.default.addOpenCloseAnalytics(drafting, inputMethod));
};

exports.setInlineCommentDraftState = setInlineCommentDraftState;

var addInlineComment = function addInlineComment(id) {
  var commandAction = function commandAction(editorState) {
    return {
      type: _types.ACTIONS.ADD_INLINE_COMMENT,
      data: {
        drafting: false,
        inlineComments: (0, _defineProperty2.default)({}, id, false),
        // Auto make the newly inserted comment selected.
        // We move the selection to the head of the comment selection.
        selectedAnnotations: [{
          id: id,
          type: _adfSchema.AnnotationTypes.INLINE_COMMENT
        }],
        editorState: editorState
      }
    };
  };

  return (0, _pluginFactory.createCommand)(commandAction, _transform.default.addInlineComment(id));
};

exports.addInlineComment = addInlineComment;

var updateMouseState = function updateMouseState(mouseData) {
  return (0, _pluginFactory.createCommand)({
    type: _types.ACTIONS.INLINE_COMMENT_UPDATE_MOUSE_STATE,
    data: {
      mouseData: mouseData
    }
  });
};

exports.updateMouseState = updateMouseState;

var createAnnotation = function createAnnotation(id) {
  var annotationType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _adfSchema.AnnotationTypes.INLINE_COMMENT;
  return function (state, dispatch) {
    // don't try to add if there are is no temp highlight bookmarked
    var _ref = (0, _utils.getPluginState)(state) || {},
        bookmark = _ref.bookmark;

    if (!bookmark || !dispatch) {
      return false;
    }

    if (annotationType === _adfSchema.AnnotationTypes.INLINE_COMMENT) {
      return addInlineComment(id)(state, dispatch);
    }

    return false;
  };
};

exports.createAnnotation = createAnnotation;

var setInlineCommentsVisibility = function setInlineCommentsVisibility(isVisible) {
  return (0, _pluginFactory.createCommand)({
    type: _types.ACTIONS.INLINE_COMMENT_SET_VISIBLE,
    data: {
      isVisible: isVisible
    }
  });
};

exports.setInlineCommentsVisibility = setInlineCommentsVisibility;