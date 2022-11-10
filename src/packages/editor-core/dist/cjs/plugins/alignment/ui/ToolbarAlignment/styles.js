"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapper = exports.triggerWrapper = exports.separator = exports.expandIconWrapper = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

var triggerWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n"])));
exports.triggerWrapper = triggerWrapper;
var separator = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  background: ", ";\n  width: 1px;\n  height: 24px;\n  display: inline-block;\n  margin: 0 8px;\n"])), (0, _tokens.token)('color.border', _colors.N30));
exports.separator = separator;
var wrapper = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  align-items: center;\n  div {\n    display: flex;\n  }\n"])));
exports.wrapper = wrapper;
var expandIconWrapper = (0, _react.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  margin-left: -8px;\n"])));
exports.expandIconWrapper = expandIconWrapper;