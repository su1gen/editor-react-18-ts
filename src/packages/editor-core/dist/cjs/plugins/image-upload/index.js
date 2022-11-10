"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _main = require("./pm-plugins/main");

var _inputRule = _interopRequireDefault(require("./pm-plugins/input-rule"));

var imageUpload = function imageUpload() {
  return {
    name: 'imageUpload',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'imageUpload',
        plugin: _main.createPlugin
      }, {
        name: 'imageUploadInputRule',
        plugin: function plugin(_ref) {
          var schema = _ref.schema,
              featureFlags = _ref.featureFlags;
          return (0, _inputRule.default)(schema, featureFlags);
        }
      }];
    }
  };
};

var _default = imageUpload;
exports.default = _default;