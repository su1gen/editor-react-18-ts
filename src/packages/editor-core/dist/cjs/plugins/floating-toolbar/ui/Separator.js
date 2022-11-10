"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var separator = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  background: ", ";\n  width: 1px;\n  height: 20px;\n  margin: 0 4px;\n  align-self: center;\n"])), (0, _tokens.token)('color.border', _colors.N30));

var _default = function _default() {
  return (0, _react.jsx)("div", {
    css: separator,
    className: "separator"
  });
};

exports.default = _default;