import _defineProperty from "@babel/runtime/helpers/defineProperty";
import React from 'react';
import { findDomRefAtPos } from 'prosemirror-utils';
import { AnnotationViewWrapper } from './AnnotationViewWrapper';
import { AnnotationTestIds } from '../types';
import { getAnnotationViewKey, getSelectionPositions, getPluginState } from '../utils';
import { removeInlineCommentNearSelection, updateInlineCommentResolvedState, setInlineCommentDraftState, createAnnotation, closeComponent } from '../commands';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE, ACTION_SUBJECT_ID } from '../../analytics';
import { CONTENT_COMPONENT } from '../../analytics/types';
import { RESOLVE_METHOD } from '../../analytics/types/inline-comment-events';

var findPosForDOM = function findPosForDOM(sel) {
  var $from = sel.$from,
      from = sel.from; // Retrieve current TextNode

  var index = $from.index();
  var node = index < $from.parent.childCount && $from.parent.child(index); // Right edge of a mark.

  if (!node && $from.nodeBefore && $from.nodeBefore.isText && $from.nodeBefore.marks.find(function (mark) {
    return mark.type.name === 'annotation';
  })) {
    return from - 1;
  }

  return from;
};

export function InlineCommentView(_ref) {
  var providers = _ref.providers,
      editorView = _ref.editorView,
      dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent;
  // As inlineComment is the only annotation present, this function is not generic
  var inlineCommentProvider = providers.inlineComment;
  var state = editorView.state,
      dispatch = editorView.dispatch;
  var CreateComponent = inlineCommentProvider.createComponent,
      ViewComponent = inlineCommentProvider.viewComponent;
  var inlineCommentState = getPluginState(state);
  var bookmark = inlineCommentState.bookmark,
      selectedAnnotations = inlineCommentState.selectedAnnotations,
      annotations = inlineCommentState.annotations;
  var selection = getSelectionPositions(state, inlineCommentState);
  var position = findPosForDOM(selection);
  var dom;

  try {
    dom = findDomRefAtPos(position, editorView.domAtPos.bind(editorView));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);

    if (dispatchAnalyticsEvent) {
      var payload = {
        action: ACTION.ERRORED,
        actionSubject: ACTION_SUBJECT.CONTENT_COMPONENT,
        eventType: EVENT_TYPE.OPERATIONAL,
        attributes: {
          component: CONTENT_COMPONENT.INLINE_COMMENT,
          selection: selection.toJSON(),
          position: position,
          docSize: editorView.state.doc.nodeSize,
          error: error.toString(),
          errorStack: error.stack || undefined
        }
      };
      dispatchAnalyticsEvent(payload);
    }
  }

  if (!dom) {
    return null;
  } // Create Component


  if (bookmark) {
    if (!CreateComponent) {
      return null;
    } //getting all text between bookmarked positions


    var textSelection = state.doc.textBetween(selection.from, selection.to);
    return /*#__PURE__*/React.createElement("div", {
      "data-testid": AnnotationTestIds.floatingComponent
    }, /*#__PURE__*/React.createElement(CreateComponent, {
      dom: dom,
      textSelection: textSelection,
      onCreate: function onCreate(id) {
        createAnnotation(id)(editorView.state, editorView.dispatch);
        !editorView.hasFocus() && editorView.focus();
      },
      onClose: function onClose() {
        setInlineCommentDraftState(false)(editorView.state, editorView.dispatch);
        !editorView.hasFocus() && editorView.focus();
      }
    }));
  } // View Component


  var activeAnnotations = selectedAnnotations.filter(function (mark) {
    return annotations[mark.id] === false;
  });

  if (!ViewComponent || activeAnnotations.length === 0) {
    return null;
  }

  var onAnnotationViewed = function onAnnotationViewed() {
    if (!dispatchAnalyticsEvent) {
      return;
    } // fire analytics


    var payload = {
      action: ACTION.VIEWED,
      actionSubject: ACTION_SUBJECT.ANNOTATION,
      actionSubjectId: ACTION_SUBJECT_ID.INLINE_COMMENT,
      eventType: EVENT_TYPE.TRACK,
      attributes: {
        overlap: activeAnnotations.length ? activeAnnotations.length - 1 : 0
      }
    };
    dispatchAnalyticsEvent(payload);
  };

  if (!selectedAnnotations) {
    return null;
  }

  return /*#__PURE__*/React.createElement(AnnotationViewWrapper, {
    "data-testid": AnnotationTestIds.floatingComponent,
    key: getAnnotationViewKey(activeAnnotations),
    onViewed: onAnnotationViewed
  }, /*#__PURE__*/React.createElement(ViewComponent, {
    annotations: activeAnnotations,
    dom: dom,
    onDelete: function onDelete(id) {
      return removeInlineCommentNearSelection(id)(state, dispatch);
    },
    onResolve: function onResolve(id) {
      return updateInlineCommentResolvedState(_defineProperty({}, id, true), RESOLVE_METHOD.COMPONENT)(editorView.state, editorView.dispatch);
    },
    onClose: function onClose() {
      closeComponent()(editorView.state, editorView.dispatch);
    }
  }));
}