"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "pluginKey", {
  enumerable: true,
  get: function get() {
    return _pluginKey.pluginKey;
  }
});

var _adfSchema = require("@atlaskit/adf-schema");

var _main = _interopRequireDefault(require("./pm-plugins/main"));

var _pluginKey = require("./pm-plugins/plugin-key");

var _keymap = require("./pm-plugins/keymap");

var captionPlugin = function captionPlugin() {
  return {
    name: 'caption',
    nodes: function nodes() {
      return [{
        name: 'caption',
        node: _adfSchema.caption
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'caption',
        plugin: function plugin(_ref) {
          var portalProviderAPI = _ref.portalProviderAPI,
              providerFactory = _ref.providerFactory,
              eventDispatcher = _ref.eventDispatcher,
              dispatch = _ref.dispatch;
          return (0, _main.default)(portalProviderAPI, eventDispatcher, providerFactory, dispatch);
        }
      }, {
        name: 'captionKeymap',
        plugin: _keymap.captionKeymap
      }];
    }
  };
};

var _default = captionPlugin;
exports.default = _default;