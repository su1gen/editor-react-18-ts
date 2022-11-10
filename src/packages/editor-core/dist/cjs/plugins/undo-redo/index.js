"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _keymaps = require("./pm-plugins/keymaps");

var _main = require("./pm-plugins/main");

var _history = require("../history");

var _ToolbarUndoRedo = _interopRequireDefault(require("./ui/ToolbarUndoRedo"));

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var undoRedoPlugin = function undoRedoPlugin() {
  return {
    name: 'undoRedoPlugin',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'undoRedoKeyMap',
        plugin: function plugin() {
          return (0, _keymaps.keymapPlugin)();
        }
      }, {
        name: 'undoRedoPlugin',
        plugin: function plugin(options) {
          return (0, _main.createPlugin)(options);
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref) {
      var editorView = _ref.editorView,
          disabled = _ref.disabled,
          isToolbarReducedSpacing = _ref.isToolbarReducedSpacing;
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          historyState: _history.historyPluginKey
        },
        render: function render(_ref2) {
          var historyState = _ref2.historyState;
          return /*#__PURE__*/_react.default.createElement(_ToolbarUndoRedo.default, {
            isReducedSpacing: isToolbarReducedSpacing,
            disabled: disabled,
            historyState: historyState,
            editorView: editorView
          });
        }
      });
    }
  };
};

var _default = undoRedoPlugin;
exports.default = _default;