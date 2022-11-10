"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nonCustomToolbarWrapperStyle = exports.mainToolbarStyle = exports.mainToolbarSecondChildStyle = exports.mainToolbarIconBeforeStyle = exports.mainToolbarFirstChildStyle = exports.customToolbarWrapperStyle = exports.MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _constants = require("@atlaskit/theme/constants");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10;

var MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = 868;
exports.MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT = MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT;
var toolbarLineHeight = 56; // box-shadow is overriden by the mainToolbar

var mainToolbarWithKeyline = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  box-shadow: 0 ", "px 0 0\n    ", ";\n"])), _editorSharedStyles.akEditorToolbarKeylineHeight, (0, _tokens.token)('color.border', _colors.N30));
var mainToolbarTwoLineStyle = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  @media (max-width: ", "px) {\n    flex-wrap: wrap;\n    height: calc(", "px * 2);\n  }\n"])), MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT, toolbarLineHeight);
var mainToolbar = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  position: relative;\n  align-items: center;\n  box-shadow: none;\n  transition: box-shadow 200ms ", ";\n  z-index: ", ";\n  display: flex;\n  height: ", "px;\n  flex-shrink: 0;\n  // TODO: https://product-fabric.atlassian.net/browse/DSP-4456\n  background-color: ", ";\n\n  & object {\n    height: 0 !important;\n  }\n\n  @media (max-width: ", "px) {\n    display: grid;\n    height: calc(", "px * 2);\n  }\n"])), _editorSharedStyles.akEditorSwoopCubicBezier, _editorSharedStyles.akEditorMenuZIndex, toolbarLineHeight, (0, _tokens.token)('elevation.surface', 'white'), _editorSharedStyles.akEditorMobileMaxWidth, toolbarLineHeight);

var mainToolbarStyle = function mainToolbarStyle(showKeyline, twoLineEditorToolbar) {
  return [mainToolbar, showKeyline && mainToolbarWithKeyline, twoLineEditorToolbar && mainToolbarTwoLineStyle];
};

exports.mainToolbarStyle = mainToolbarStyle;
var mainToolbarIconBeforeStyle = (0, _react.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  margin: ", "px;\n  height: ", "px;\n  width: ", "px;\n  @media (max-width: ", "px) {\n    grid-column: 1;\n    grid-row: 1;\n  }\n"])), (0, _constants.gridSize)() * 2, (0, _constants.gridSize)() * 4, (0, _constants.gridSize)() * 4, _editorSharedStyles.akEditorMobileMaxWidth);
exports.mainToolbarIconBeforeStyle = mainToolbarIconBeforeStyle;
var mainToolbarFirstChild = (0, _react.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-grow: 1;\n\n  @media (max-width: ", "px) {\n    grid-column: 1;\n    grid-row: 1;\n  }\n"])), _editorSharedStyles.akEditorMobileMaxWidth);
var mainToolbarFirstChildTowLine = (0, _react.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  @media (max-width: ", "px) {\n    flex: 1 1 100%;\n    height: ", "px;\n    justify-content: flex-end;\n    // ED-10241: We add fit-content to ensure that MainToolbar does not\n    // shrink more than the size of its contents. This will prevent the\n    // find/replace icon from being overlapped during a confluence\n    // publish operation\n    min-width: fit-content;\n  }\n"])), MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT, toolbarLineHeight);

var mainToolbarFirstChildStyle = function mainToolbarFirstChildStyle(twoLineEditorToolbar) {
  return [mainToolbarFirstChild, twoLineEditorToolbar && mainToolbarFirstChildTowLine];
};

exports.mainToolbarFirstChildStyle = mainToolbarFirstChildStyle;
var mainToolbarSecondChild = (0, _react.css)(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2.default)(["\n  // ED-10241: We add fit-content to ensure that MainToolbar does not\n  // shrink more than the size of its contents. This will prevent the\n  // find/replace icon from being overlapped during a confluence\n  // publish operation\n  min-width: fit-content;\n"])));
var mainToolbarSecondChildTwoLine = (0, _react.css)(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2.default)(["\n  @media (max-width: ", "px) {\n    display: flex;\n    flex-grow: 1;\n    flex: 1 1 100%;\n    margin: auto;\n    height: ", "px;\n    min-width: 0;\n  }\n"])), MAXIMUM_TWO_LINE_TOOLBAR_BREAKPOINT, toolbarLineHeight);

var mainToolbarSecondChildStyle = function mainToolbarSecondChildStyle(twoLineEditorToolbar) {
  return [mainToolbarSecondChild, twoLineEditorToolbar && mainToolbarSecondChildTwoLine];
};

exports.mainToolbarSecondChildStyle = mainToolbarSecondChildStyle;
var nonCustomToolbarWrapperStyle = (0, _react.css)(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2.default)(["\n  align-items: center;\n  display: flex;\n  flex-grow: 1;\n"])));
exports.nonCustomToolbarWrapperStyle = nonCustomToolbarWrapperStyle;
var customToolbarWrapperStyle = (0, _react.css)(_templateObject10 || (_templateObject10 = (0, _taggedTemplateLiteral2.default)(["\n  align-items: center;\n  display: flex;\n"])));
exports.customToolbarWrapperStyle = customToolbarWrapperStyle;