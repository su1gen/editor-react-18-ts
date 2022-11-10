"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.textFormattingStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _styles = require("@atlaskit/editor-common/styles");

var _templateObject;

var textFormattingStyles = function textFormattingStyles(props) {
  return (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  ", "\n"])), (0, _styles.codeMarkSharedStyles)(props));
};

exports.textFormattingStyles = textFormattingStyles;