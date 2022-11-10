"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dateStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _styles = require("@atlaskit/editor-common/styles");

var _tokens = require("@atlaskit/tokens");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _templateObject;

var dateStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .", " {\n    .", " {\n      line-height: initial;\n      cursor: pointer;\n    }\n\n    &.", " {\n      .", " > span {\n        ", "\n      }\n    }\n  }\n\n  .danger {\n    .", ".", "\n      .", "\n      > span {\n      box-shadow: 0 0 0 ", "px\n        ", ";\n    }\n  }\n"])), _styles.DateSharedCssClassName.DATE_CONTAINER, _styles.DateSharedCssClassName.DATE_WRAPPER, _editorSharedStyles.akEditorSelectedNodeClassName, _styles.DateSharedCssClassName.DATE_WRAPPER, (0, _editorSharedStyles.getSelectionStyles)([_editorSharedStyles.SelectionStyle.BoxShadow]), _styles.DateSharedCssClassName.DATE_CONTAINER, _editorSharedStyles.akEditorSelectedNodeClassName, _styles.DateSharedCssClassName.DATE_WRAPPER, _editorSharedStyles.akEditorSelectedBorderSize, (0, _tokens.token)('color.border.danger', _editorSharedStyles.akEditorDeleteBorder));
exports.dateStyles = dateStyles;