"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WithEditorView = void 0;

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _EditorContext = require("../ui/EditorContext");

var WithEditorView = function WithEditorView(WrappedComponent) {
  var _WithFeatureFlags = function _WithFeatureFlags(props) {
    var _useEditorContext = (0, _EditorContext.useEditorContext)(),
        editorActions = _useEditorContext.editorActions;

    return /*#__PURE__*/_react.default.createElement(WrappedComponent, (0, _extends2.default)({}, props, {
      editorView: editorActions === null || editorActions === void 0 ? void 0 : editorActions._privateGetEditorView()
    }));
  };

  return _WithFeatureFlags;
};

exports.WithEditorView = WithEditorView;