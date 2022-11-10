"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _main = _interopRequireDefault(require("./pm-plugins/main"));

var copyButtonPlugin = function copyButtonPlugin() {
  return {
    name: 'copyButton',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'copyButton',
        plugin: function plugin() {
          return (0, _main.default)();
        }
      }];
    }
  };
};

var _default = copyButtonPlugin;
exports.default = _default;