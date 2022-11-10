"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _adfSchema = require("@atlaskit/adf-schema");

var _keymap = require("./pm-plugins/keymap");

var indentationPlugin = function indentationPlugin() {
  return {
    name: 'indentation',
    marks: function marks() {
      return [{
        name: 'indentation',
        mark: _adfSchema.indentation
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'indentationKeymap',
        plugin: function plugin() {
          return (0, _keymap.keymapPlugin)();
        }
      }];
    }
  };
};

var _default = indentationPlugin;
exports.default = _default;