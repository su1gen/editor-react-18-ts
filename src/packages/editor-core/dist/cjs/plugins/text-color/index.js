"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "textColorPluginKey", {
  enumerable: true,
  get: function get() {
    return _main.pluginKey;
  }
});

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _main = require("./pm-plugins/main");

var _ToolbarTextColor = _interopRequireDefault(require("./ui/ToolbarTextColor"));

var pluginConfig = function pluginConfig(textColorConfig) {
  if (!textColorConfig || typeof textColorConfig === 'boolean') {
    return undefined;
  }

  return textColorConfig;
};

var textColorPlugin = function textColorPlugin(textColorConfig) {
  return {
    name: 'textColor',
    marks: function marks() {
      return [{
        name: 'textColor',
        mark: _adfSchema.textColor
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'textColor',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return (0, _main.createPlugin)(dispatch, pluginConfig(textColorConfig));
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref2) {
      var editorView = _ref2.editorView,
          popupsMountPoint = _ref2.popupsMountPoint,
          popupsBoundariesElement = _ref2.popupsBoundariesElement,
          popupsScrollableElement = _ref2.popupsScrollableElement,
          isToolbarReducedSpacing = _ref2.isToolbarReducedSpacing,
          dispatchAnalyticsEvent = _ref2.dispatchAnalyticsEvent,
          disabled = _ref2.disabled;
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          textColor: _main.pluginKey
        },
        render: function render(_ref3) {
          var textColor = _ref3.textColor;
          return /*#__PURE__*/_react.default.createElement(_ToolbarTextColor.default, {
            pluginState: textColor,
            isReducedSpacing: isToolbarReducedSpacing,
            editorView: editorView,
            popupsMountPoint: popupsMountPoint,
            popupsBoundariesElement: popupsBoundariesElement,
            popupsScrollableElement: popupsScrollableElement,
            dispatchAnalyticsEvent: dispatchAnalyticsEvent,
            disabled: disabled
          });
        }
      });
    }
  };
};

var _default = textColorPlugin;
exports.default = _default;