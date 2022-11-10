"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Editor = Editor;
Object.defineProperty(exports, "EditorContent", {
  enumerable: true,
  get: function get() {
    return _EditorContent.EditorContent;
  }
});
Object.defineProperty(exports, "EditorSharedConfigConsumer", {
  enumerable: true,
  get: function get() {
    return _sharedConfig.EditorSharedConfigConsumer;
  }
});
Object.defineProperty(exports, "PresetProvider", {
  enumerable: true,
  get: function get() {
    return _presetContext.PresetProvider;
  }
});
Object.defineProperty(exports, "useEditorSharedConfig", {
  enumerable: true,
  get: function get() {
    return _sharedConfig.useEditorSharedConfig;
  }
});

var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));

var _react = _interopRequireDefault(require("react"));

var _reactIntlNext = require("react-intl-next");

var _PortalProvider = require("../../ui/PortalProvider");

var _EditorInternal = require("./internal/components/EditorInternal");

var _presetContext = require("./internal/context/preset-context");

var _sharedConfig = require("./internal/context/shared-config");

var _EditorContent = require("./internal/components/EditorContent");

/**
 * Main Editor component. Use in combination with `EditorContent` and a `Preset`.
 * Internally it constructs `ProseMirror View` and mounts it to `EditorContent`.
 *
 * `EditorContent` can be wrapped to implement any layout/design requirements.
 *
 * ```js
 * <Preset>
 *   <Editor>
 *     <EditorContent/>
 *   </Editor>
 * </Preset>
 * ```
 */
function Editor(props) {
  var plugins = (0, _presetContext.usePresetContext)();
  return /*#__PURE__*/_react.default.createElement(_reactIntlNext.IntlProvider, {
    locale: "en"
  }, /*#__PURE__*/_react.default.createElement(_PortalProvider.PortalProvider, {
    onAnalyticsEvent: props.onAnalyticsEvent,
    render: function render(portalProviderAPI) {
      return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_EditorInternal.EditorInternal, (0, _extends2.default)({}, props, {
        plugins: plugins.length ? plugins : props.plugins,
        portalProviderAPI: portalProviderAPI,
        onAnalyticsEvent: props.onAnalyticsEvent
      })), /*#__PURE__*/_react.default.createElement(_PortalProvider.PortalRenderer, {
        portalProviderAPI: portalProviderAPI
      }));
    }
  }));
}
/**
 *
 * Public API Exports.
 *
 */