"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.triggerWrapper = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _templateObject;

var triggerWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  width: 42px;\n\n  display: flex;\n  align-items: center;\n\n  > div,\n  > span {\n    display: flex;\n  }\n\n  > div > div {\n    display: flex;\n  }\n"])));
exports.triggerWrapper = triggerWrapper;