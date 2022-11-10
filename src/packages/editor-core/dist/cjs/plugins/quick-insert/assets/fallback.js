"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = IconFallback;

var _react = _interopRequireDefault(require("react"));

function IconFallback() {
  return /*#__PURE__*/_react.default.createElement("svg", {
    focusable: "false",
    "aria-hidden": true,
    width: 40,
    height: 40
  }, /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement("linearGradient", {
    x1: "-26.046%",
    y1: "100%",
    x2: "62.626%",
    y2: "0%",
    id: "fallback-a"
  }, /*#__PURE__*/_react.default.createElement("stop", {
    stopColor: "#B3BAC5",
    offset: "0%"
  }), /*#__PURE__*/_react.default.createElement("stop", {
    stopColor: "#A5ADBA",
    offset: "100%"
  }))), /*#__PURE__*/_react.default.createElement("g", {
    fill: "none",
    fillRule: "evenodd"
  }, /*#__PURE__*/_react.default.createElement("path", {
    fill: "#FFF",
    d: "M0 0h40v40H0z"
  }), /*#__PURE__*/_react.default.createElement("path", {
    fill: "#DFE1E6",
    d: "M20 16h12v12H20z"
  }), /*#__PURE__*/_react.default.createElement("path", {
    fill: "url(#fallback-a)",
    d: "M8 16h12v12H8z"
  }), /*#__PURE__*/_react.default.createElement("path", {
    d: "M20 16c-4 .5-6.029 2.5-6.086 6-.057 3.5-2.028 5.5-5.914 6h12V16z",
    fill: "#A5ADBA"
  }), /*#__PURE__*/_react.default.createElement("path", {
    fill: "#B3BAC5",
    d: "M17.5 13h5v3h-5z"
  }), /*#__PURE__*/_react.default.createElement("path", {
    fill: "#A5ADBA",
    d: "M10 13h5v3h-5z"
  }), /*#__PURE__*/_react.default.createElement("path", {
    fill: "#DFE1E6",
    d: "M25 13h5v3h-5z"
  })));
}