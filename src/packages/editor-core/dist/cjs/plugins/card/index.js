"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _react = _interopRequireDefault(require("react"));

var _adfSchema = require("@atlaskit/adf-schema");

var _main = require("./pm-plugins/main");

var _toolbar = require("./toolbar");

var _EditorSmartCardEvents = require("./ui/EditorSmartCardEvents");

var _keymap = require("./pm-plugins/keymap");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var cardPlugin = function cardPlugin(options) {
  return {
    name: 'card',
    nodes: function nodes() {
      var nodes = [{
        name: 'inlineCard',
        node: _adfSchema.inlineCard
      }, {
        name: 'blockCard',
        node: _adfSchema.blockCard
      }];

      if (options.allowEmbeds) {
        nodes.push({
          name: 'embedCard',
          node: _adfSchema.embedCard
        });
      }

      return nodes;
    },
    pmPlugins: function pmPlugins() {
      var _options$allowBlockCa, _options$allowResizin, _options$useAlternati;

      var allowBlockCards = (_options$allowBlockCa = options.allowBlockCards) !== null && _options$allowBlockCa !== void 0 ? _options$allowBlockCa : true;
      var allowResizing = (_options$allowResizin = options.allowResizing) !== null && _options$allowResizin !== void 0 ? _options$allowResizin : true;
      var useAlternativePreloader = (_options$useAlternati = options.useAlternativePreloader) !== null && _options$useAlternati !== void 0 ? _options$useAlternati : true;
      var plugins = [{
        name: 'card',
        plugin: (0, _main.createPlugin)(_objectSpread(_objectSpread({}, options), {}, {
          allowBlockCards: allowBlockCards,
          allowResizing: allowResizing,
          useAlternativePreloader: useAlternativePreloader
        }))
      }];
      plugins.push({
        name: 'cardKeymap',
        plugin: function plugin(_ref) {
          var featureFlags = _ref.featureFlags;
          return (0, _keymap.cardKeymap)(featureFlags);
        }
      });
      return plugins;
    },
    contentComponent: function contentComponent(_ref2) {
      var editorView = _ref2.editorView;
      return /*#__PURE__*/_react.default.createElement(_EditorSmartCardEvents.EditorSmartCardEvents, {
        editorView: editorView
      });
    },
    pluginsOptions: {
      floatingToolbar: (0, _toolbar.floatingToolbar)(options, options.platform, options.linkPicker)
    }
  };
};

var _default = cardPlugin;
exports.default = _default;