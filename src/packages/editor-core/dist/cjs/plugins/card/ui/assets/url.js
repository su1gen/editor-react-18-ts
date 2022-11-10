"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IconUrl = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _icon = _interopRequireDefault(require("@atlaskit/icon"));

var IconUrlGlyph = function IconUrlGlyph(props) {
  return /*#__PURE__*/_react.default.createElement("svg", (0, _extends2.default)({
    width: "32",
    height: "32",
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), /*#__PURE__*/_react.default.createElement("rect", {
    x: "6",
    y: "15",
    width: "20",
    height: "2",
    rx: "1",
    fill: "currentColor"
  }));
};

var IconUrl = function IconUrl(props) {
  return /*#__PURE__*/_react.default.createElement(_icon.default, (0, _extends2.default)({
    glyph: IconUrlGlyph
  }, props));
};

exports.IconUrl = IconUrl;