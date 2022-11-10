"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.placeholderStyles = exports.placeHolderClassName = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var placeHolderClassName = 'placeholder-decoration';
exports.placeHolderClassName = placeHolderClassName;
var placeholderStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .ProseMirror .", " {\n    position: relative;\n    color: ", ";\n    width: 100%;\n\n    pointer-events: none;\n    display: block;\n    user-select: none;\n\n    > span {\n      position: absolute;\n      pointer-events: none;\n      outline: none;\n    }\n\n    &.align-end > span {\n      right: 0;\n    }\n\n    &.align-center > span {\n      left: 0;\n    }\n  }\n"])), placeHolderClassName, (0, _tokens.token)('color.text.subtlest', _colors.N200));
exports.placeholderStyles = placeholderStyles;