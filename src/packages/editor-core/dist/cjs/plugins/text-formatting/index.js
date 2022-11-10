"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _WithPluginState = _interopRequireDefault(require("../../ui/WithPluginState"));

var _main = require("./pm-plugins/main");

var _clearFormatting = require("./pm-plugins/clear-formatting");

var _clearFormattingKeymap = _interopRequireDefault(require("./pm-plugins/clear-formatting-keymap"));

var _cursor = _interopRequireDefault(require("./pm-plugins/cursor"));

var _inputRule = _interopRequireDefault(require("./pm-plugins/input-rule"));

var _keymap = _interopRequireDefault(require("./pm-plugins/keymap"));

var _smartInputRule = _interopRequireDefault(require("./pm-plugins/smart-input-rule"));

var _Toolbar = _interopRequireDefault(require("./ui/Toolbar"));

var textFormatting = function textFormatting() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    name: 'textFormatting',
    marks: function marks() {
      return [{
        name: 'em',
        mark: _adfSchema.em
      }, {
        name: 'strong',
        mark: _adfSchema.strong
      }, {
        name: 'strike',
        mark: _adfSchema.strike
      }].concat(options.disableCode ? [] : {
        name: 'code',
        mark: _adfSchema.code
      }).concat(options.disableSuperscriptAndSubscript ? [] : {
        name: 'subsup',
        mark: _adfSchema.subsup
      }).concat(options.disableUnderline ? [] : {
        name: 'underline',
        mark: _adfSchema.underline
      });
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'textFormatting',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return (0, _main.plugin)(dispatch);
        }
      }, {
        name: 'textFormattingCursor',
        plugin: function plugin() {
          return _cursor.default;
        }
      }, {
        name: 'textFormattingInputRule',
        plugin: function plugin(_ref2) {
          var schema = _ref2.schema,
              featureFlags = _ref2.featureFlags;
          return (0, _inputRule.default)(schema, featureFlags);
        }
      }, {
        name: 'textFormattingSmartRule',
        plugin: function plugin(_ref3) {
          var featureFlags = _ref3.featureFlags;
          return !options.disableSmartTextCompletion ? (0, _smartInputRule.default)(featureFlags) : undefined;
        }
      }, {
        name: 'textFormattingClear',
        plugin: function plugin(_ref4) {
          var dispatch = _ref4.dispatch;
          return (0, _clearFormatting.plugin)(dispatch);
        }
      }, {
        name: 'textFormattingClearKeymap',
        plugin: function plugin() {
          return (0, _clearFormattingKeymap.default)();
        }
      }, {
        name: 'textFormattingKeymap',
        plugin: function plugin(_ref5) {
          var schema = _ref5.schema;
          return (0, _keymap.default)(schema);
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref6) {
      var editorView = _ref6.editorView,
          popupsMountPoint = _ref6.popupsMountPoint,
          popupsScrollableElement = _ref6.popupsScrollableElement,
          isToolbarReducedSpacing = _ref6.isToolbarReducedSpacing,
          toolbarSize = _ref6.toolbarSize,
          disabled = _ref6.disabled;
      return /*#__PURE__*/_react.default.createElement(_WithPluginState.default, {
        plugins: {
          textFormattingState: _main.pluginKey,
          clearFormattingPluginState: _clearFormatting.pluginKey
        },
        render: function render() {
          return /*#__PURE__*/_react.default.createElement(_Toolbar.default, {
            editorState: editorView.state,
            popupsMountPoint: popupsMountPoint,
            popupsScrollableElement: popupsScrollableElement,
            toolbarSize: toolbarSize,
            isReducedSpacing: isToolbarReducedSpacing,
            editorView: editorView,
            isToolbarDisabled: disabled,
            shouldUseResponsiveToolbar: Boolean(options.responsiveToolbarMenu)
          });
        }
      });
    }
  };
};

var _default = textFormatting;
exports.default = _default;