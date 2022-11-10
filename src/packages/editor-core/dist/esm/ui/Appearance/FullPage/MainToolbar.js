import _taggedTemplateLiteral from "@babel/runtime/helpers/taggedTemplateLiteral";

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10;

import { css } from '@emotion/react';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { gridSize } from '@atlaskit/theme/constants';
import { akEditorMenuZIndex, akEditorSwoopCubicBezier, akEditorToolbarKeylineHeight, akEditorMobileMaxWidth } from '@atlaskit/editor-shared-styles';
export var MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 868;
var toolbarLineHeight = 56; // box-shadow is overriden by the mainToolbar

var mainToolbarWithKeyline = css(_templateObject || (_templateObject = _taggedTemplateLiteral(["\n  box-shadow: 0 ", "px 0 0\n    ", ";\n"])), akEditorToolbarKeylineHeight, token('color.border', N30));
var mainToolbarTwoLineStyle = css(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n  @media (max-width: ", "px) {\n    flex-wrap: wrap;\n    height: calc(", "px * 2);\n  }\n"])), MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT, toolbarLineHeight);
var mainToolbar = css(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n  position: relative;\n  align-items: center;\n  box-shadow: none;\n  transition: box-shadow 200ms ", ";\n  z-index: ", ";\n  display: flex;\n  height: ", "px;\n  flex-shrink: 0;\n  // TODO: https://product-fabric.atlassian.net/browse/DSP-4456\n  background-color: ", ";\n\n  & object {\n    height: 0 !important;\n  }\n\n  @media (max-width: ", "px) {\n    display: grid;\n    height: calc(", "px * 2);\n  }\n"])), akEditorSwoopCubicBezier, akEditorMenuZIndex, toolbarLineHeight, token('elevation.surface', 'white'), akEditorMobileMaxWidth, toolbarLineHeight);
export var mainToolbarStyle = function mainToolbarStyle(showKeyline, twoLineEditorToolbar) {
  return [mainToolbar, showKeyline && mainToolbarWithKeyline, twoLineEditorToolbar && mainToolbarTwoLineStyle];
};
export var mainToolbarIconBeforeStyle = css(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n  margin: ", "px;\n  height: ", "px;\n  width: ", "px;\n  @media (max-width: ", "px) {\n    grid-column: 1;\n    grid-row: 1;\n  }\n"])), gridSize() * 2, gridSize() * 4, gridSize() * 4, akEditorMobileMaxWidth);
var mainToolbarFirstChild = css(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["\n  display: flex;\n  flex-grow: 1;\n\n  @media (max-width: ", "px) {\n    grid-column: 1;\n    grid-row: 1;\n  }\n"])), akEditorMobileMaxWidth);
var mainToolbarFirstChildTowLine = css(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(["\n  @media (max-width: ", "px) {\n    flex: 1 1 100%;\n    height: ", "px;\n    justify-content: flex-end;\n    // ED-10241: We add fit-content to ensure that MainToolbar does not\n    // shrink more than the size of its contents. This will prevent the\n    // find/replace icon from being overlapped during a confluence\n    // publish operation\n    min-width: fit-content;\n  }\n"])), MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT, toolbarLineHeight);
export var mainToolbarFirstChildStyle = function mainToolbarFirstChildStyle(twoLineEditorToolbar) {
  return [mainToolbarFirstChild, twoLineEditorToolbar && mainToolbarFirstChildTowLine];
};
var mainToolbarSecondChild = css(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n  // ED-10241: We add fit-content to ensure that MainToolbar does not\n  // shrink more than the size of its contents. This will prevent the\n  // find/replace icon from being overlapped during a confluence\n  // publish operation\n  min-width: fit-content;\n"])));
var mainToolbarSecondChildTwoLine = css(_templateObject8 || (_templateObject8 = _taggedTemplateLiteral(["\n  @media (max-width: ", "px) {\n    display: flex;\n    flex-grow: 1;\n    flex: 1 1 100%;\n    margin: auto;\n    height: ", "px;\n    min-width: 0;\n  }\n"])), MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT, toolbarLineHeight);
export var mainToolbarSecondChildStyle = function mainToolbarSecondChildStyle(twoLineEditorToolbar) {
  return [mainToolbarSecondChild, twoLineEditorToolbar && mainToolbarSecondChildTwoLine];
};
export var nonCustomToolbarWrapperStyle = css(_templateObject9 || (_templateObject9 = _taggedTemplateLiteral(["\n  align-items: center;\n  display: flex;\n  flex-grow: 1;\n"])));
export var customToolbarWrapperStyle = css(_templateObject10 || (_templateObject10 = _taggedTemplateLiteral(["\n  align-items: center;\n  display: flex;\n"])));