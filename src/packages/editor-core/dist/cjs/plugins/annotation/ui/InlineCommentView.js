"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InlineCommentView = InlineCommentView;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _prosemirrorUtils = require("prosemirror-utils");

var _AnnotationViewWrapper = require("./AnnotationViewWrapper");

var _types = require("../types");

var _utils = require("../utils");

var _commands = require("../commands");

var _analytics = require("../../analytics");

var _types2 = require("../../analytics/types");

var _inlineCommentEvents = require("../../analytics/types/inline-comment-events");

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

function InlineCommentView(_ref) {
  var providers = _ref.providers,
      editorView = _ref.editorView,
      dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent;
  // As inlineComment is the only annotation present, this function is not generic
  var inlineCommentProvider = providers.inlineComment;
  var state = editorView.state,
      dispatch = editorView.dispatch;
  var CreateComponent = inlineCommentProvider.createComponent,
      ViewComponent = inlineCommentProvider.viewComponent;
  var inlineCommentState = (0, _utils.getPluginState)(state);
  var bookmark = inlineCommentState.bookmark,
      selectedAnnotations = inlineCommentState.selectedAnnotations,
      annotations = inlineCommentState.annotations;
  var selection = (0, _utils.getSelectionPositions)(state, inlineCommentState);
  var position = findPosForDOM(selection);
  var dom;

  try {
    dom = (0, _prosemirrorUtils.findDomRefAtPos)(position, editorView.domAtPos.bind(editorView));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);

    if (dispatchAnalyticsEvent) {
      var payload = {
        action: _analytics.ACTION.ERRORED,
        actionSubject: _analytics.ACTION_SUBJECT.CONTENT_COMPONENT,
        eventType: _analytics.EVENT_TYPE.OPERATIONAL,
        attributes: {
          component: _types2.CONTENT_COMPONENT.INLINE_COMMENT,
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
    return /*#__PURE__*/_react.default.createElement("div", {
      "data-testid": _types.AnnotationTestIds.floatingComponent
    }, /*#__PURE__*/_react.default.createElement(CreateComponent, {
      dom: dom,
      textSelection: textSelection,
      onCreate: function onCreate(id) {
        (0, _commands.createAnnotation)(id)(editorView.state, editorView.dispatch);
        !editorView.hasFocus() && editorView.focus();
      },
      onClose: function onClose() {
        (0, _commands.setInlineCommentDraftState)(false)(editorView.state, editorView.dispatch);
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
      action: _analytics.ACTION.VIEWED,
      actionSubject: _analytics.ACTION_SUBJECT.ANNOTATION,
      actionSubjectId: _analytics.ACTION_SUBJECT_ID.INLINE_COMMENT,
      eventType: _analytics.EVENT_TYPE.TRACK,
      attributes: {
        overlap: activeAnnotations.length ? activeAnnotations.length - 1 : 0
      }
    };
    dispatchAnalyticsEvent(payload);
  };

  if (!selectedAnnotations) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_AnnotationViewWrapper.AnnotationViewWrapper, {
    "data-testid": _types.AnnotationTestIds.floatingComponent,
    key: (0, _utils.getAnnotationViewKey)(activeAnnotations),
    onViewed: onAnnotationViewed
  }, /*#__PURE__*/_react.default.createElement(ViewComponent, {
    annotations: activeAnnotations,
    dom: dom,
    onDelete: function onDelete(id) {
      return (0, _commands.removeInlineCommentNearSelection)(id)(state, dispatch);
    },
    onResolve: function onResolve(id) {
      return (0, _commands.updateInlineCommentResolvedState)((0, _defineProperty2.default)({}, id, true), _inlineCommentEvents.RESOLVE_METHOD.COMPONENT)(editorView.state, editorView.dispatch);
    },
    onClose: function onClose() {
      (0, _commands.closeComponent)()(editorView.state, editorView.dispatch);
    }
  }));
}