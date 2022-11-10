"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.unsupportedStyles = exports.UnsupportedSharedCssClassName = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var UnsupportedSharedCssClassName = {
  BLOCK_CONTAINER: 'unsupportedBlockView-content-wrap',
  INLINE_CONTAINER: 'unsupportedInlineView-content-wrap'
};
exports.UnsupportedSharedCssClassName = UnsupportedSharedCssClassName;
var inlineUnsupportedSelector = ".".concat(UnsupportedSharedCssClassName.INLINE_CONTAINER, " > span:nth-of-type(2)");
var blockUnsupportedSelector = ".".concat(UnsupportedSharedCssClassName.BLOCK_CONTAINER, " > div");
var unsupportedStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  ", ", ", " {\n    cursor: pointer;\n  }\n\n  .", "", ",\n    .", "", " {\n    ", "\n  }\n\n  .danger {\n    .", "", ",\n      .", "", " {\n      border: ", "px solid\n        ", ";\n      background-color: ", ";\n    }\n  }\n"])), blockUnsupportedSelector, inlineUnsupportedSelector, _editorSharedStyles.akEditorSelectedNodeClassName, blockUnsupportedSelector, _editorSharedStyles.akEditorSelectedNodeClassName, inlineUnsupportedSelector, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.Background, _editorSharedStyles.SelectionStyle.Border]), _editorSharedStyles.akEditorSelectedNodeClassName, blockUnsupportedSelector, _editorSharedStyles.akEditorSelectedNodeClassName, inlineUnsupportedSelector, _editorSharedStyles.akEditorSelectedBorderSize, (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteBorder), (0, _tokens.token)('color.blanket.danger', _editorSharedStyles.akEditorDeleteBackgroundWithOpacity));
exports.unsupportedStyles = unsupportedStyles;