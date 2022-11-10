"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapperStyle = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _constants = require("@atlaskit/theme/constants");

var _styles = require("../styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var wrapperStyle = function wrapperStyle(theme) {
  return (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  ", "\n\n  cursor: pointer;\n  display: inline-flex;\n  margin: 1px 1px 4px;\n\n  > img {\n    border-radius: ", "px;\n  }\n\n  &::after,\n  &::before {\n    vertical-align: text-top;\n    display: inline-block;\n    width: 1px;\n    content: '';\n  }\n\n  &.with-children {\n    padding: 0;\n    background: ", ";\n  }\n"])), (0, _styles.wrapperDefault)(theme), (0, _constants.borderRadius)(), (0, _tokens.token)('color.background.neutral.subtle', 'white'));
};

exports.wrapperStyle = wrapperStyle;