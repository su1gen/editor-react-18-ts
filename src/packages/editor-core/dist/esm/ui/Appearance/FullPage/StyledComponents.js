import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10;

import { css } from '@emotion/react';
import { akEditorFullWidthLayoutWidth, akEditorGutterPadding, akEditorSwoopCubicBezier, akLayoutGutterOffset, ATLASSIAN_NAVIGATION_HEIGHT, akEditorContextPanelWidth } from '@atlaskit/editor-shared-styles';
import { taskListSelector, decisionListSelector } from '@atlaskit/adf-schema';
import { createEditorContentStyle } from '../../ContentStyles';
import { tableFullPageEditorStyles } from '@atlaskit/editor-plugin-table/ui/common-styles';
import { tableMarginFullWidthMode } from '@atlaskit/editor-plugin-table/ui/consts';
import { scrollbarStyles } from '../../styles';
var SWOOP_ANIMATION = "0.5s ".concat(akEditorSwoopCubicBezier);
var TOTAL_PADDING = akEditorGutterPadding * 2;
export var fullPageEditorWrapper = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  min-width: 340px;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n"])));
var scrollStyles = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  flex-grow: 1;\n  height: 100%;\n  overflow-y: scroll;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  scroll-behavior: smooth;\n  ", ";\n"])), scrollbarStyles);
export var ScrollContainer = createEditorContentStyle(scrollStyles);
ScrollContainer.displayName = 'ScrollContainer'; // transition used to match scrollbar with config panel opening animation
// only use animation when opening as there is a bug with floating toolbars.

export var positionedOverEditorStyle = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  padding: 0 ", "px;\n  transition: padding 500ms ", ";\n"])), akEditorContextPanelWidth, akEditorSwoopCubicBezier);
export var contentArea = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-direction: row;\n  height: calc(100% - ", ");\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  transition: padding 0ms ", ";\n"])), ATLASSIAN_NAVIGATION_HEIGHT, akEditorSwoopCubicBezier);
export var sidebarArea = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  height: 100%;\n  box-sizing: border-box;\n  align-self: flex-end;\n"]))); // initially hide until we have a containerWidth and can properly size them,
// otherwise they can cause the editor width to extend which is non-recoverable

export var editorContentAreaHideContainer = css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  .fabric-editor--full-width-mode {\n    .pm-table-container,\n    .code-block,\n    .extension-container {\n      display: none;\n    }\n  }\n"])));
/* Prevent horizontal scroll on page in full width mode */

var editorContentAreaContainerStyle = function editorContentAreaContainerStyle(containerWidth) {
  return css(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  .fabric-editor--full-width-mode {\n    .pm-table-container,\n    .code-block,\n    .extension-container {\n      max-width: ", "px;\n    }\n\n    [data-layout-section] {\n      max-width: ", "px;\n    }\n  }\n"])), containerWidth - TOTAL_PADDING - tableMarginFullWidthMode * 2, containerWidth - TOTAL_PADDING + akLayoutGutterOffset * 2);
};

export var editorContentAreaStyle = function editorContentAreaStyle(_ref) {
  var layoutMaxWidth = _ref.layoutMaxWidth,
      fullWidthMode = _ref.fullWidthMode,
      containerWidth = _ref.containerWidth;
  return [editorContentArea, !fullWidthMode && editorContentAreaWithLayoutWith(layoutMaxWidth), containerWidth ? editorContentAreaContainerStyle(containerWidth) : editorContentAreaHideContainer];
};

var editorContentAreaWithLayoutWith = function editorContentAreaWithLayoutWith(layoutMaxWidth) {
  return css(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  max-width: ", "px;\n"])), layoutMaxWidth + TOTAL_PADDING);
};

var editorContentArea = css(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  line-height: 24px;\n  padding-top: 50px;\n  padding-bottom: 55px;\n  height: calc(\n    100% - 105px\n  ); /* fill the viewport: 100% - (padding top & bottom) */\n  width: 100%;\n  margin: auto;\n  flex-direction: column;\n  flex-grow: 1;\n\n  max-width: ", "px;\n  transition: max-width ", ";\n  & .ProseMirror {\n    flex-grow: 1;\n    box-sizing: border-box;\n  }\n\n  & .ProseMirror {\n    & > * {\n      /* pre-emptively clear all direct descendant content, just in case any are adjacent floated content */\n      clear: both;\n    }\n    > p,\n    > ul,\n    > ol:not(", "):not(", "),\n    > h1,\n    > h2,\n    > h3,\n    > h4,\n    > h5,\n    > h6 {\n      /* deliberately allow wrapping of text based nodes, just in case any are adjacent floated content */\n      clear: none;\n    }\n\n    > p:last-child {\n      margin-bottom: 24px;\n    }\n  }\n\n  ", ";\n\n  .fabric-editor--full-width-mode {\n    /* Full Width Mode styles for ignoring breakout sizes */\n    .fabric-editor-breakout-mark,\n    .extension-container.block,\n    .pm-table-container {\n      width: 100% !important;\n    }\n\n    .fabric-editor-breakout-mark {\n      margin-left: unset !important;\n      transform: none !important;\n    }\n  }\n"])), akEditorFullWidthLayoutWidth + TOTAL_PADDING, SWOOP_ANIMATION, taskListSelector, decisionListSelector, tableFullPageEditorStyles);
export var editorContentGutterStyle = css(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n  box-sizing: border-box;\n  padding: 0 ", "px;\n"])), akEditorGutterPadding);