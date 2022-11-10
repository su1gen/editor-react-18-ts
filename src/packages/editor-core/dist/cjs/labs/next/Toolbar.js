"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toolbar = Toolbar;

var _react = _interopRequireDefault(require("react"));

var _editorDisabled = require("../../plugins/editor-disabled");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _Toolbar = _interopRequireDefault(require("../../ui/Toolbar"));

var _Editor = require("./Editor");

function Toolbar(_ref) {
  var containerElement = _ref.containerElement;
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
      return /*#__PURE__*/_react.default.createElement(_Toolbar.default, {
        editorView: config.editorView,
        eventDispatcher: config.eventDispatcher,
        providerFactory: config.providerFactory,
        items: config.primaryToolbarComponents,
        popupsMountPoint: config.popupsMountPoint,
        popupsBoundariesElement: config.popupsBoundariesElement,
        popupsScrollableElement: config.popupsScrollableElement,
        disabled: (_disabled$editorDisab = disabled === null || disabled === void 0 ? void 0 : disabled.editorDisabled) !== null && _disabled$editorDisab !== void 0 ? _disabled$editorDisab : false,
        containerElement: containerElement
      });
    }
  });
}