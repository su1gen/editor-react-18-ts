"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropdownItem = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var dropdownItem = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  align-items: center;\n  cursor: pointer;\n  text-decoration: none;\n  padding: 8px 32px 8px 12px;\n  color: ", ";\n  > span {\n    display: flex;\n    margin-right: 8px;\n  }\n  &:hover {\n    background-color: ", ";\n  }\n"])), (0, _tokens.token)('color.text', _colors.N800), (0, _tokens.token)('color.background.neutral.subtle.hovered', _colors.N20));
exports.dropdownItem = dropdownItem;