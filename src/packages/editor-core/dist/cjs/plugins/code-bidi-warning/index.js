"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _main = require("./pm-plugins/main");

var codeBidiWarning = function codeBidiWarning(_ref) {
  var appearance = _ref.appearance;
  return {
    name: 'codeBidiWarning',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'codeBidiWarning',
        plugin: function plugin(options) {
          return (0, _main.createPlugin)(options, {
            appearance: appearance
          });
        }
      }];
    }
  };
};

var _default = codeBidiWarning;
exports.default = _default;