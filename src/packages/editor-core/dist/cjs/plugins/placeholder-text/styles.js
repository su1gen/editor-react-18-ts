"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.placeholderTextStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var placeholderTextStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .ProseMirror span[data-placeholder] {\n    color: ", ";\n    display: inline;\n  }\n\n  .ProseMirror span.pm-placeholder {\n    display: inline;\n    color: ", ";\n  }\n  .ProseMirror span.pm-placeholder__text {\n    display: inline;\n    color: ", ";\n  }\n\n  .ProseMirror span.pm-placeholder.", " {\n    ", "\n  }\n\n  .ProseMirror span.pm-placeholder__text[data-placeholder]::after {\n    color: ", ";\n    cursor: text;\n    content: attr(data-placeholder);\n    display: inline;\n  }\n"])), (0, _tokens.token)('color.text.subtlest', _colors.N300), (0, _tokens.token)('color.text.subtlest', _colors.N300), (0, _tokens.token)('color.text.subtlest', _colors.N300), _editorSharedStyles.akEditorSelectedNodeClassName, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.Background]), (0, _tokens.token)('color.text.subtlest', _colors.N300));
exports.placeholderTextStyles = placeholderTextStyles;