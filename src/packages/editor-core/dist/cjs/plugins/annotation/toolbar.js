"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildToolbar = exports.annotationMessages = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactIntlNext = require("react-intl-next");

var _comment = _interopRequireDefault(require("@atlaskit/icon/glyph/comment"));

var _keymaps = require("../../keymaps");

var _commands = require("./commands");

var _types = require("./types");

var _utils = require("./utils");

var annotationMessages = (0, _reactIntlNext.defineMessages)({
  createComment: {
    id: 'fabric.editor.createComment',
    defaultMessage: 'Comment',
    description: 'Create/add an inline comment based on the users selection'
  },
  createCommentInvalid: {
    id: 'fabric.editor.createCommentInvalid',
    defaultMessage: 'You can only comment on text and headings',
    description: 'Error message to communicate to the user they can only do the current action in certain contexts'
  },
  toolbar: {
    id: 'fabric.editor.annotationToolbar',
    defaultMessage: 'Annotation toolbar',
    description: 'A label for a toolbar (UI element) that creates annotations/comments in the document'
  }
});
/*
  Calculates the position of the floating toolbar relative to the selection.

  This is a re-implementation which closely matches the behaviour on Confluence renderer.
  The main difference is the popup is always above the selection.

  Things to consider:
  - popup is always above the selection
  - coordinates of head X and getBoundingClientRect() are absolute in client viewport (not including scroll offsets)
  - popup may appear in '.fabric-editor-popup-scroll-parent' (or body)
  - we use the toolbarRect to center align toolbar
  - use wrapperBounds to clamp values
  - editorView.dom bounds differ to wrapperBounds, convert at the end
*/

exports.annotationMessages = annotationMessages;

var calculateToolbarPositionAboveSelection = function calculateToolbarPositionAboveSelection(toolbarTitle) {
  return function (editorView, nextPos) {
    var toolbar = document.querySelector("div[aria-label=\"".concat(toolbarTitle, "\"]"));

    if (!toolbar) {
      return nextPos;
    } // scroll wrapper for full page, fall back to document body
    // TODO: look into using getScrollGutterOptions()


    var scrollWrapper = editorView.dom.closest('.fabric-editor-popup-scroll-parent') || document.body;
    var wrapperBounds = scrollWrapper.getBoundingClientRect();
    var selection = window && window.getSelection();
    var range = selection && !selection.isCollapsed && selection.getRangeAt(0);

    if (!range) {
      return nextPos;
    }

    var toolbarRect = toolbar.getBoundingClientRect();
    var _editorView$state$sel = editorView.state.selection,
        head = _editorView$state$sel.head,
        anchor = _editorView$state$sel.anchor;
    var topCoords = editorView.coordsAtPos(Math.min(head, anchor));
    var bottomCoords = editorView.coordsAtPos(Math.max(head, anchor) - Math.min(range.endOffset, 1));
    var top = (topCoords.top || 0) - toolbarRect.height * 1.5;
    var left = 0; // If not on the same line

    if (topCoords.top !== bottomCoords.top) {
      // selecting downwards
      if (head > anchor) {
        left = Math.max(topCoords.right, bottomCoords.right);
      } else {
        left = Math.min(topCoords.left, bottomCoords.left);
      }
      /*
        short selection above a long paragraph
         eg. short {<}heading
        The purpose of this text is to show the selection range{>}.
         The horizontal positioning should center around "heading",
        not where it ends at "range".
         Note: if it was "head<b>ing</b>" then it would only center
        around "head". Undesireable but matches the current renderer.
      */


      var cliffPosition = range.getClientRects()[0];

      if (cliffPosition.right < left) {
        left = cliffPosition.left + cliffPosition.width / 2;
      }
    } else {
      // Otherwise center on the single line selection
      left = topCoords.left + (bottomCoords.right - topCoords.left) / 2;
    }

    left -= toolbarRect.width / 2; // remap positions from browser document to wrapperBounds

    return {
      top: top - wrapperBounds.top + scrollWrapper.scrollTop,
      left: Math.max(0, left - wrapperBounds.left)
    };
  };
};
/*
  Calculates the position of the floating toolbar relative to the selection.

  This is a re-implementation which closely matches the behaviour on Confluence renderer.
  The main difference is the popup is always above the selection.

  Things to consider:
  - stick as close to the head X release coordinates as possible
  - coordinates of head X and getBoundingClientRect() are absolute in client viewport (not including scroll offsets)
  - popup may appear in '.fabric-editor-popup-scroll-parent' (or body)
  - we use the toolbarRect to center align toolbar
  - use wrapperBounds to clamp values
  - editorView.dom bounds differ to wrapperBounds, convert at the end
*/


var calculateToolbarPositionTrackHead = function calculateToolbarPositionTrackHead(toolbarTitle) {
  return function (editorView, nextPos) {
    var toolbar = document.querySelector("div[aria-label=\"".concat(toolbarTitle, "\"]"));

    if (!toolbar) {
      return nextPos;
    } // scroll wrapper for full page, fall back to document body
    // TODO: look into using getScrollGutterOptions()


    var scrollWrapper = editorView.dom.closest('.fabric-editor-popup-scroll-parent') || document.body;
    var wrapperBounds = scrollWrapper.getBoundingClientRect();
    var selection = window && window.getSelection();
    var range = selection && !selection.isCollapsed && selection.getRangeAt(0);

    if (!range) {
      return nextPos;
    }

    var toolbarRect = toolbar.getBoundingClientRect();
    var _editorView$state$sel2 = editorView.state.selection,
        head = _editorView$state$sel2.head,
        anchor = _editorView$state$sel2.anchor;
    var topCoords = editorView.coordsAtPos(Math.min(head, anchor));
    var bottomCoords = editorView.coordsAtPos(Math.max(head, anchor) - Math.min(range.endOffset, 1));
    var top; // If not the same line, display toolbar below.

    if (head > anchor && topCoords.top !== bottomCoords.top) {
      // We are taking the previous pos to the maxium, so avoid end of line positions
      // returning the next line's rect.
      top = (bottomCoords.top || 0) + toolbarRect.height / 1.15;
    } else {
      top = (topCoords.top || 0) - toolbarRect.height * 1.5;
    }

    var left = (head > anchor ? bottomCoords.right : topCoords.left) - toolbarRect.width / 2; // remap positions from browser document to wrapperBounds

    return {
      top: top - wrapperBounds.top + scrollWrapper.scrollTop,
      left: Math.max(0, left - wrapperBounds.left)
    };
  };
};

var buildToolbar = function buildToolbar(state, intl) {
  var isToolbarAbove = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var schema = state.schema;
  var selectionValid = (0, _utils.isSelectionValid)(state);

  if (selectionValid === _types.AnnotationSelectionType.INVALID) {
    return undefined;
  }

  var createCommentMessage = intl.formatMessage(annotationMessages.createComment);
  var commentDisabledMessage = intl.formatMessage(annotationMessages.createCommentInvalid);
  var createComment = {
    type: 'button',
    showTitle: true,
    disabled: selectionValid === _types.AnnotationSelectionType.DISABLED,
    testId: _types.AnnotationTestIds.floatingToolbarCreateButton,
    icon: _comment.default,
    tooltipContent: selectionValid === _types.AnnotationSelectionType.DISABLED ? commentDisabledMessage : /*#__PURE__*/_react.default.createElement(_keymaps.ToolTipContent, {
      description: createCommentMessage,
      keymap: _keymaps.addInlineComment
    }),
    title: createCommentMessage,
    onClick: function onClick(state, dispatch) {
      return (0, _commands.setInlineCommentDraftState)(true)(state, dispatch);
    }
  };
  var annotation = schema.marks.annotation;
  var validNodes = Object.keys(schema.nodes).reduce(function (acc, current) {
    var type = schema.nodes[current];

    if (type.allowsMarkType(annotation)) {
      acc.push(type);
    }

    return acc;
  }, []);
  var toolbarTitle = intl.formatMessage(annotationMessages.toolbar);
  var calcToolbarPosition = isToolbarAbove ? calculateToolbarPositionAboveSelection : calculateToolbarPositionTrackHead;
  var onPositionCalculated = calcToolbarPosition(toolbarTitle);
  return {
    title: toolbarTitle,
    nodeType: validNodes,
    items: [createComment],
    onPositionCalculated: onPositionCalculated
  };
};

exports.buildToolbar = buildToolbar;