"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _adfSchema = require("@atlaskit/adf-schema");

var _main = require("./pm-plugins/main");

var _keymap = _interopRequireDefault(require("./pm-plugins/keymap"));

var _uniqueId = require("./pm-plugins/unique-id");

var _toolbar = require("./toolbar");

var _contextPanel = require("./context-panel");

var extensionPlugin = function extensionPlugin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    name: 'extension',
    nodes: function nodes() {
      return [{
        name: 'extension',
        node: _adfSchema.extension
      }, {
        name: 'bodiedExtension',
        node: _adfSchema.bodiedExtension
      }, {
        name: 'inlineExtension',
        node: _adfSchema.inlineExtension
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'extension',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch,
              providerFactory = _ref.providerFactory,
              portalProviderAPI = _ref.portalProviderAPI,
              eventDispatcher = _ref.eventDispatcher;
          var extensionHandlers = options.extensionHandlers || {};
          return (0, _main.createPlugin)(dispatch, providerFactory, extensionHandlers, portalProviderAPI, eventDispatcher, options.useLongPressSelection, {
            appearance: options.appearance
          });
        }
      }, {
        name: 'extensionKeymap',
        plugin: _keymap.default
      }, {
        name: 'extensionUniqueId',
        plugin: function plugin() {
          return (0, _uniqueId.createPlugin)();
        }
      }];
    },
    pluginsOptions: {
      floatingToolbar: (0, _toolbar.getToolbarConfig)(options.breakoutEnabled),
      contextPanel: (0, _contextPanel.getContextPanel)(options.allowAutoSave)
    }
  };
};

var _default = extensionPlugin;
exports.default = _default;