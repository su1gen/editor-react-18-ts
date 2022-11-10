"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Mobile;

var _react = _interopRequireDefault(require("react"));

var _Mobile = require("../AppearanceComponents/Mobile");

var _WidthEmitter = _interopRequireDefault(require("../WidthEmitter"));

function Mobile(_ref) {
  var editorView = _ref.editorView,
      maxHeight = _ref.maxHeight,
      persistScrollGutter = _ref.persistScrollGutter,
      editorDOMElement = _ref.editorDOMElement,
      disabled = _ref.disabled;
  return /*#__PURE__*/_react.default.createElement(_Mobile.MobileAppearance, {
    editorView: editorView || null,
    maxHeight: maxHeight,
    persistScrollGutter: persistScrollGutter,
    editorDisabled: disabled
  }, editorDOMElement, editorView && /*#__PURE__*/_react.default.createElement(_WidthEmitter.default, {
    editorView: editorView
  }));
}