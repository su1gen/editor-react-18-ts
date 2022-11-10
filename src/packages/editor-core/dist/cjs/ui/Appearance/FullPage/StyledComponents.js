"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sidebarArea = exports.positionedOverEditorStyle = exports.fullPageEditorWrapper = exports.editorContentGutterStyle = exports.editorContentAreaStyle = exports.editorContentAreaHideContainer = exports.contentArea = exports.ScrollContainer = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _adfSchema = require("@atlaskit/adf-schema");

var _ContentStyles = require("../../ContentStyles");

var _commonStyles = require("@atlaskit/editor-plugin-table/ui/common-styles");

var _consts = require("@atlaskit/editor-plugin-table/ui/consts");

var _styles = require("../../styles");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10;

var SWOOP_ANIMATION = "0.5s ".concat(_editorSharedStyles.akEditorSwoopCubicBezier);
var TOTAL_PADDING = _editorSharedStyles.akEditorGutterPadding * 2;
var fullPageEditorWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  min-width: 340px;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n"])));
exports.fullPageEditorWrapper = fullPageEditorWrapper;
var scrollStyles = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  flex-grow: 1;\n  height: 100%;\n  overflow-y: scroll;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  scroll-behavior: smooth;\n  ", ";\n"])), _styles.scrollbarStyles);
var ScrollContainer = (0, _ContentStyles.createEditorContentStyle)(scrollStyles);
exports.ScrollContainer = ScrollContainer;
ScrollContainer.displayName = 'ScrollContainer'; // transition used to match scrollbar with config panel opening animation
// only use animation when opening as there is a bug with floating toolbars.

var positionedOverEditorStyle = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  padding: 0 ", "px;\n  transition: padding 500ms ", ";\n"])), _editorSharedStyles.akEditorContextPanelWidth, _editorSharedStyles.akEditorSwoopCubicBezier);
exports.positionedOverEditorStyle = positionedOverEditorStyle;
var contentArea = (0, _react.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: row;\n  height: calc(100% - ", ");\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  transition: padding 0ms ", ";\n"])), _editorSharedStyles.ATLASSIAN_NAVIGATION_HEIGHT, _editorSharedStyles.akEditorSwoopCubicBezier);
exports.contentArea = contentArea;
var sidebarArea = (0, _react.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  height: 100%;\n  box-sizing: border-box;\n  align-self: flex-end;\n"]))); // initially hide until we have a containerWidth and can properly size them,
// otherwise they can cause the editor width to extend which is non-recoverable

exports.sidebarArea = sidebarArea;
var editorContentAreaHideContainer = (0, _react.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  .fabric-editor--full-width-mode {\n    .pm-table-container,\n    .code-block,\n    .extension-container {\n      display: none;\n    }\n  }\n"])));
/* Prevent horizontal scroll on page in full width mode */

exports.editorContentAreaHideContainer = editorContentAreaHideContainer;

var editorContentAreaContainerStyle = function editorContentAreaContainerStyle(containerWidth) {
  return (0, _react.css)(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2.default)(["\n  .fabric-editor--full-width-mode {\n    .pm-table-container,\n    .code-block,\n    .extension-container {\n      max-width: ", "px;\n    }\n\n    [data-layout-section] {\n      max-width: ", "px;\n    }\n  }\n"])), containerWidth - TOTAL_PADDING - _consts.tableMarginFullWidthMode * 2, containerWidth - TOTAL_PADDING + _editorSharedStyles.akLayoutGutterOffset * 2);
};

var editorContentAreaStyle = function editorContentAreaStyle(_ref) {
  var layoutMaxWidth = _ref.layoutMaxWidth,
      fullWidthMode = _ref.fullWidthMode,
      containerWidth = _ref.containerWidth;
  return [editorContentArea, !fullWidthMode && editorContentAreaWithLayoutWith(layoutMaxWidth), containerWidth ? editorContentAreaContainerStyle(containerWidth) : editorContentAreaHideContainer];
};

exports.editorContentAreaStyle = editorContentAreaStyle;

var editorContentAreaWithLayoutWith = function editorContentAreaWithLayoutWith(layoutMaxWidth) {
  return (0, _react.css)(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2.default)(["\n  max-width: ", "px;\n"])), layoutMaxWidth + TOTAL_PADDING);
};

var editorContentArea = (0, _react.css)(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2.default)(["\n  line-height: 24px;\n  padding-top: 50px;\n  padding-bottom: 55px;\n  height: calc(\n    100% - 105px\n  ); /* fill the viewport: 100% - (padding top & bottom) */\n  width: 100%;\n  margin: auto;\n  flex-direction: column;\n  flex-grow: 1;\n\n  max-width: ", "px;\n  transition: max-width ", ";\n  & .ProseMirror {\n    flex-grow: 1;\n    box-sizing: border-box;\n  }\n\n  & .ProseMirror {\n    & > * {\n      /* pre-emptively clear all direct descendant content, just in case any are adjacent floated content */\n      clear: both;\n    }\n    > p,\n    > ul,\n    > ol:not(", "):not(", "),\n    > h1,\n    > h2,\n    > h3,\n    > h4,\n    > h5,\n    > h6 {\n      /* deliberately allow wrapping of text based nodes, just in case any are adjacent floated content */\n      clear: none;\n    }\n\n    > p:last-child {\n      margin-bottom: 24px;\n    }\n  }\n\n  ", ";\n\n  .fabric-editor--full-width-mode {\n    /* Full Width Mode styles for ignoring breakout sizes */\n    .fabric-editor-breakout-mark,\n    .extension-container.block,\n    .pm-table-container {\n      width: 100% !important;\n    }\n\n    .fabric-editor-breakout-mark {\n      margin-left: unset !important;\n      transform: none !important;\n    }\n  }\n"])), _editorSharedStyles.akEditorFullWidthLayoutWidth + TOTAL_PADDING, SWOOP_ANIMATION, _adfSchema.taskListSelector, _adfSchema.decisionListSelector, _commonStyles.tableFullPageEditorStyles);
var editorContentGutterStyle = (0, _react.css)(_templateObject10 || (_templateObject10 = (0, _taggedTemplateLiteral2.default)(["\n  box-sizing: border-box;\n  padding: 0 ", "px;\n"])), _editorSharedStyles.akEditorGutterPadding);
exports.editorContentGutterStyle = editorContentGutterStyle;