"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _spinner = _interopRequireDefault(require("@atlaskit/spinner"));

var _templateObject;

var spinnerWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  justify-content: center;\n  margin-top: 64px;\n"])));

var LoadingState = function LoadingState() {
  return (0, _react.jsx)("div", {
    css: spinnerWrapper
  }, (0, _react.jsx)(_spinner.default, {
    size: "small"
  }));
};

var _default = LoadingState;
exports.default = _default;