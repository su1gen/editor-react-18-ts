"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.panelTextInputWithCustomWidth = exports.panelTextInput = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2;

// Normal .className gets overridden by input[type=text] hence this hack to produce input.className
var panelTextInput = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  input& {\n    background: transparent;\n    border: 0;\n    border-radius: 0;\n    box-sizing: content-box;\n    color: ", ";\n    flex-grow: 1;\n    font-size: ", ";\n    line-height: 20px;\n    padding: 0;\n    min-width: 145px;\n\n    /* Hides IE10+ built-in [x] clear input button */\n    &::-ms-clear {\n      display: none;\n    }\n\n    &:focus {\n      outline: none;\n    }\n\n    &::placeholder {\n      color: ", ";\n    }\n  }\n"])), (0, _tokens.token)('color.text.subtle', _colors.N400), (0, _editorSharedStyles.relativeFontSizeToBase16)(13), (0, _tokens.token)('color.text.subtlest', _colors.N100));
exports.panelTextInput = panelTextInput;

var panelTextInputWithCustomWidth = function panelTextInputWithCustomWidth(width) {
  return (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  input& {\n    width: ", "px;\n  }\n"])), width);
};

exports.panelTextInputWithCustomWidth = panelTextInputWithCustomWidth;