"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IconInline = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _icon = _interopRequireDefault(require("@atlaskit/icon"));

var IconInlineGlyph = function IconInlineGlyph(props) {
  return /*#__PURE__*/_react.default.createElement("svg", (0, _extends2.default)({
    width: "32",
    height: "32",
    viewBox: "0 0 32 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, props), /*#__PURE__*/_react.default.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M8 12c-1.10457 0-2 .8954-2 2v4c0 1.1046.89543 2 2 2h16c1.1046 0 2-.8954 2-2v-4c0-1.1046-.8954-2-2-2H8Zm0 3c0-.5523.44772-1 1-1h2c.5523 0 1 .4477 1 1v2c0 .5523-.4477 1-1 1H9c-.55228 0-1-.4477-1-1v-2Zm5 1c0-.2761.2239-.5.5-.5h10c.2761 0 .5.2239.5.5s-.2239.5-.5.5h-10c-.2761 0-.5-.2239-.5-.5Z",
    fill: "currentColor"
  }));
};

var IconInline = function IconInline(props) {
  return /*#__PURE__*/_react.default.createElement(_icon.default, (0, _extends2.default)({
    glyph: IconInlineGlyph
  }, props));
};

exports.IconInline = IconInline;