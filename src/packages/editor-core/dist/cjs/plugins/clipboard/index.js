"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _main = require("./pm-plugins/main");

var clipboard = function clipboard() {
  return {
    name: 'clipboard',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'clipboard',
        plugin: function plugin(options) {
          return (0, _main.createPlugin)(options);
        }
      }];
    }
  };
};

var _default = clipboard;
exports.default = _default;