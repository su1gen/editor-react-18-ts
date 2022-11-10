"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inputStyle = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var inputStyle = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  /* Normal .className gets overridden by input[type=text] hence this hack to produce input.className */\n  input& {\n    background-color: ", ";\n    border: 1px solid ", ";\n    border-radius: ", "px;\n    box-sizing: border-box;\n    height: 40px;\n    padding-left: 20px;\n    padding-top: 12px;\n    padding-bottom: 12px;\n    font-size: ", ";\n    width: 100%;\n    font-weight: 400;\n    line-height: 1.42857142857143;\n    letter-spacing: -0.005em;\n    color: ", ";\n\n    &:hover {\n      background-color: ", ";\n      border-color: ", ";\n      cursor: text;\n    }\n  }\n"])), (0, _tokens.token)('color.background.input', 'white'), (0, _tokens.token)('color.border.input', _editorSharedStyles.akEditorSubtleAccent), (0, _constants.borderRadius)(), (0, _editorSharedStyles.relativeFontSizeToBase16)(14), (0, _tokens.token)('color.text.subtlest', _colors.N300), (0, _tokens.token)('color.background.input.hovered', 'white'), (0, _tokens.token)('color.border.input', _colors.N50));
exports.inputStyle = inputStyle;