"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EditorContentProvider = exports.EditorContent = void 0;

var _react = _interopRequireDefault(require("react"));

var EditorContentContext = /*#__PURE__*/_react.default.createContext(function () {});

var EditorContentProvider = EditorContentContext.Provider;
/**
 * ProseMirror View mount point.
 */

exports.EditorContentProvider = EditorContentProvider;

var EditorContent = /*#__PURE__*/_react.default.memo(function () {
  var handleRef = _react.default.useContext(EditorContentContext);

  return /*#__PURE__*/_react.default.createElement("div", {
    style: {
      height: '100%'
    },
    ref: handleRef
  });
});

exports.EditorContent = EditorContent;