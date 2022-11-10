"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toolbar = void 0;

var _react = _interopRequireDefault(require("react"));

var _ToolbarInner = require("./ToolbarInner");

var _types = require("./types");

var Toolbar = function Toolbar(props) {
  return /*#__PURE__*/_react.default.createElement(_ToolbarInner.ToolbarInner, {
    items: props.items,
    editorView: props.editorView,
    editorActions: props.editorActions,
    eventDispatcher: props.eventDispatcher,
    providerFactory: props.providerFactory,
    appearance: props.appearance,
    popupsMountPoint: props.popupsMountPoint,
    popupsBoundariesElement: props.popupsBoundariesElement,
    popupsScrollableElement: props.popupsScrollableElement,
    disabled: props.disabled,
    dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
    toolbarSize: props.toolbarSize,
    isToolbarReducedSpacing: props.toolbarSize < _types.ToolbarSize.XXL,
    containerElement: props.containerElement
  });
};

exports.Toolbar = Toolbar;