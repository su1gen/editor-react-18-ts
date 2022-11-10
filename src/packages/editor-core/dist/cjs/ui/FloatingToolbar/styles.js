"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.container = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2;

var container = function container(height) {
  return (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  border-radius: ", "px;\n  box-shadow: ", ";\n  display: flex;\n  align-items: center;\n  box-sizing: border-box;\n  padding: 4px 8px;\n  background-color: ", ";\n  ", ";\n"])), (0, _constants.borderRadius)(), (0, _tokens.token)('elevation.shadow.overlay', "0 12px 24px -6px ".concat(_colors.N50A, ", 0 0 1px ").concat(_colors.N60A)), (0, _tokens.token)('color.background.input', _colors.N0), height ? (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n        height: ", "px;\n      "])), height) : '');
};

exports.container = container;