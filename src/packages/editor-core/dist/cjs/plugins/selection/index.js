"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectionPlugin = exports.default = void 0;

var _selectionMain = require("./pm-plugins/selection-main");

var _keymap = _interopRequireDefault(require("./pm-plugins/keymap"));

var _gapCursorMain = _interopRequireDefault(require("./pm-plugins/gap-cursor-main"));

var _gapCursorKeymap = _interopRequireDefault(require("./pm-plugins/gap-cursor-keymap"));

var selectionPlugin = function selectionPlugin(options) {
  return {
    name: 'selection',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'selection',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch,
              dispatchAnalyticsEvent = _ref.dispatchAnalyticsEvent;
          return (0, _selectionMain.createPlugin)(dispatch, dispatchAnalyticsEvent, options);
        }
      }, {
        name: 'selectionKeymap',
        plugin: _keymap.default
      }, {
        name: 'gapCursorKeymap',
        plugin: function plugin() {
          return (0, _gapCursorKeymap.default)();
        }
      }, {
        name: 'gapCursor',
        plugin: function plugin() {
          return _gapCursorMain.default;
        }
      }];
    }
  };
};

exports.selectionPlugin = selectionPlugin;
var _default = selectionPlugin;
exports.default = _default;