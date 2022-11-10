"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.gridStyles = exports.GRID_GUTTER = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var GRID_GUTTER = 12;
exports.GRID_GUTTER = GRID_GUTTER;
var gridStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .gridParent {\n    width: calc(100% + ", "px);\n    margin-left: -", "px;\n    margin-right: -", "px;\n    transform: scale(1);\n    z-index: ", ";\n  }\n\n  .gridContainer {\n    position: fixed;\n    height: 100vh;\n    width: 100%;\n    pointer-events: none;\n  }\n\n  // TODO: https://product-fabric.atlassian.net/browse/DSP-4352\n  .gridLine {\n    border-left: 1px solid ", ";\n    display: inline-block;\n    box-sizing: border-box;\n    height: 100%;\n    margin-left: -1px;\n\n    transition: border-color 0.15s linear;\n    z-index: 0;\n  }\n\n  .highlight {\n    border-left: 1px solid ", ";\n  }\n"])), GRID_GUTTER * 2, GRID_GUTTER, GRID_GUTTER, _editorSharedStyles.akEditorGridLineZIndex, (0, _tokens.token)('color.border', _colors.N30A), (0, _tokens.token)('color.border.focused', _colors.B200));
exports.gridStyles = gridStyles;