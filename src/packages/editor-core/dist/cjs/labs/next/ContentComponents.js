"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ContentComponents = ContentComponents;

var _react = _interopRequireDefault(require("react"));

var _editorDisabled = require("../../plugins/editor-disabled");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _PluginSlot = _interopRequireDefault(require("../../ui/PluginSlot"));

var _Editor = require("./Editor");

function ContentComponents(_ref) {
  var disabled = _ref.disabled,
      wrapperElement = _ref.wrapperElement,
      containerElement = _ref.containerElement;
  var config = (0, _Editor.useEditorSharedConfig)();

  if (!config) {
    return null;
  }

  return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
    plugins: {
      disabled: _editorDisabled.pluginKey
    },
    render: function render(_ref2) {
      var _disabled$editorDisab;

      var disabled = _ref2.disabled;
      return /*#__PURE__*/_react.default.createElement(_PluginSlot.default, {
        editorView: config.editorView,
        eventDispatcher: config.eventDispatcher,
        providerFactory: config.providerFactory,
        items: config.contentComponents,
        popupsMountPoint: config.popupsMountPoint,
        popupsBoundariesElement: config.popupsBoundariesElement,
        popupsScrollableElement: config.popupsScrollableElement,
        containerElement: containerElement // TODO: Figure out how to pass containerElement here ED-8448
        ,
        wrapperElement: wrapperElement,
        disabled: (_disabled$editorDisab = disabled === null || disabled === void 0 ? void 0 : disabled.editorDisabled) !== null && _disabled$editorDisab !== void 0 ? _disabled$editorDisab : false
      });
    }
  });
}