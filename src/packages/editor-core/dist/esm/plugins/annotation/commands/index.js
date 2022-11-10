import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { AnnotationTypes } from '@atlaskit/adf-schema';
import { createCommand } from '../pm-plugins/plugin-factory';
import { INPUT_METHOD } from '../../analytics';
import { isSelectionValid, getPluginState } from '../utils';
import { ACTIONS } from '../pm-plugins/types';
import transform from './transform';
import { AnnotationSelectionType } from '../types';
export var updateInlineCommentResolvedState = function updateInlineCommentResolvedState(partialNewState, resolveMethod) {
  var command = {
    type: ACTIONS.UPDATE_INLINE_COMMENT_STATE,
    data: partialNewState
  };
  var allResolved = Object.values(partialNewState).every(function (state) {
    return state;
  });

  if (resolveMethod && allResolved) {
    return createCommand(command, transform.addResolveAnalytics(resolveMethod));
  }

  return createCommand(command);
};
export var closeComponent = function closeComponent() {
  return createCommand({
    type: ACTIONS.CLOSE_COMPONENT
  });
};
export var clearDirtyMark = function clearDirtyMark() {
  return createCommand({
    type: ACTIONS.INLINE_COMMENT_CLEAR_DIRTY_MARK
  });
};
export var removeInlineCommentNearSelection = function removeInlineCommentNearSelection(id) {
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
      type: AnnotationTypes.INLINE_COMMENT
    }));

    if (dispatch) {
      dispatch(tr);
    }

    return true;
  };
};

var getDraftCommandAction = function getDraftCommandAction(drafting) {
  return function (editorState) {
    // validate selection only when entering draft mode
    if (drafting && isSelectionValid(editorState) !== AnnotationSelectionType.VALID) {
      return false;
    }

    return {
      type: ACTIONS.SET_INLINE_COMMENT_DRAFT_STATE,
      data: {
        drafting: drafting,
        editorState: editorState
      }
    };
  };
};

export var setInlineCommentDraftState = function setInlineCommentDraftState(drafting) {
  var inputMethod = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : INPUT_METHOD.TOOLBAR;
  var commandAction = getDraftCommandAction(drafting);
  return createCommand(commandAction, transform.addOpenCloseAnalytics(drafting, inputMethod));
};
export var addInlineComment = function addInlineComment(id) {
  var commandAction = function commandAction(editorState) {
    return {
      type: ACTIONS.ADD_INLINE_COMMENT,
      data: {
        drafting: false,
        inlineComments: _defineProperty({}, id, false),
        // Auto make the newly inserted comment selected.
        // We move the selection to the head of the comment selection.
        selectedAnnotations: [{
          id: id,
          type: AnnotationTypes.INLINE_COMMENT
        }],
        editorState: editorState
      }
    };
  };

  return createCommand(commandAction, transform.addInlineComment(id));
};
export var updateMouseState = function updateMouseState(mouseData) {
  return createCommand({
    type: ACTIONS.INLINE_COMMENT_UPDATE_MOUSE_STATE,
    data: {
      mouseData: mouseData
    }
  });
};
export var createAnnotation = function createAnnotation(id) {
  var annotationType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : AnnotationTypes.INLINE_COMMENT;
  return function (state, dispatch) {
    // don't try to add if there are is no temp highlight bookmarked
    var _ref = getPluginState(state) || {},
        bookmark = _ref.bookmark;

    if (!bookmark || !dispatch) {
      return false;
    }

    if (annotationType === AnnotationTypes.INLINE_COMMENT) {
      return addInlineComment(id)(state, dispatch);
    }

    return false;
  };
};
export var setInlineCommentsVisibility = function setInlineCommentsVisibility(isVisible) {
  return createCommand({
    type: ACTIONS.INLINE_COMMENT_SET_VISIBLE,
    data: {
      isVisible: isVisible
    }
  });
};