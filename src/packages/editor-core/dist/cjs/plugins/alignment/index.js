"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultConfig = exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _main = require("./pm-plugins/main");

var _commands = require("./commands");

var _ToolbarAlignment = _interopRequireDefault(require("./ui/ToolbarAlignment"));

var _keymap = require("./pm-plugins/keymap");

var defaultConfig = {
  align: 'start'
};
exports.defaultConfig = defaultConfig;

var alignmentPlugin = function alignmentPlugin() {
  return {
    name: 'alignment',
    marks: function marks() {
      return [{
        name: 'alignment',
        mark: _adfSchema.alignment
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'alignmentPlugin',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return (0, _main.createPlugin)(dispatch, defaultConfig);
        }
      }, {
        name: 'annotationKeymap',
        plugin: function plugin() {
          return (0, _keymap.keymapPlugin)();
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref2) {
      var editorView = _ref2.editorView,
          popupsMountPoint = _ref2.popupsMountPoint,
          popupsBoundariesElement = _ref2.popupsBoundariesElement,
          popupsScrollableElement = _ref2.popupsScrollableElement,
          disabled = _ref2.disabled,
          isToolbarReducedSpacing = _ref2.isToolbarReducedSpacing;
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          align: _main.pluginKey
        },
        render: function render(_ref3) {
          var align = _ref3.align;
          return /*#__PURE__*/_react.default.createElement(_ToolbarAlignment.default, {
            pluginState: align,
            isReducedSpacing: isToolbarReducedSpacing,
            changeAlignment: function changeAlignment(align) {
              return (0, _commands.changeAlignment)(align)(editorView.state, editorView.dispatch);
            },
            disabled: disabled || !align.isEnabled,
            popupsMountPoint: popupsMountPoint,
            popupsBoundariesElement: popupsBoundariesElement,
            popupsScrollableElement: popupsScrollableElement
          });
        }
      });
    }
  };
};

var _default = alignmentPlugin;
exports.default = _default;