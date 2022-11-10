"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extensionStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var extensionStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .extensionView-content-wrap,\n  .bodiedExtensionView-content-wrap {\n    margin: ", " 0;\n\n    &:first-of-type {\n      margin-top: 0;\n    }\n\n    &:last-of-type {\n      margin-bottom: 0;\n    }\n\n    &:not(.danger).", " {\n      & > span > .extension-container {\n        ", "\n      }\n    }\n\n    &.danger > span > .extension-container {\n      box-shadow: 0 0 0 ", "px\n        ", ";\n      background-color: ", ";\n    }\n\n    &.inline {\n      word-wrap: break-all;\n    }\n  }\n\n  .extensionView-content-wrap .extension-container {\n    overflow: hidden;\n  }\n\n  .bodiedExtensionView-content-wrap\n    .extensionView-content-wrap\n    .extension-container {\n    width: 100%;\n    max-width: 100%; // ensure width can't go over 100%;\n  }\n"])), _editorSharedStyles.blockNodesVerticalMargin, _editorSharedStyles.akEditorSelectedNodeClassName, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.BoxShadow]), _editorSharedStyles.akEditorSelectedBorderSize, (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteBorder), (0, _tokens.token)('color.background.danger', _editorSharedStyles.akEditorDeleteBackground));
exports.extensionStyles = extensionStyles;