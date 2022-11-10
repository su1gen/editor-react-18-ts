"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findReplacePlugin = exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _plugin = require("./plugin");

var _keymap = _interopRequireDefault(require("./keymap"));

var _FindReplaceToolbarButtonWithState = _interopRequireDefault(require("./FindReplaceToolbarButtonWithState"));

var findReplacePlugin = function findReplacePlugin(props) {
  return {
    name: 'findReplace',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'findReplace',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return (0, _plugin.createPlugin)(dispatch);
        }
      }, {
        name: 'findReplaceKeymap',
        plugin: function plugin() {
          return (0, _keymap.default)();
        }
      }];
    },
    primaryToolbarComponent: function primaryToolbarComponent(_ref2) {
      var popupsBoundariesElement = _ref2.popupsBoundariesElement,
          popupsMountPoint = _ref2.popupsMountPoint,
          popupsScrollableElement = _ref2.popupsScrollableElement,
          isToolbarReducedSpacing = _ref2.isToolbarReducedSpacing,
          editorView = _ref2.editorView,
          containerElement = _ref2.containerElement,
          dispatchAnalyticsEvent = _ref2.dispatchAnalyticsEvent;

      if (props.twoLineEditorToolbar) {
        return null;
      } else {
        return /*#__PURE__*/_react.default.createElement(_FindReplaceToolbarButtonWithState.default, {
          popupsBoundariesElement: popupsBoundariesElement,
          popupsMountPoint: popupsMountPoint,
          popupsScrollableElement: popupsScrollableElement,
          isToolbarReducedSpacing: isToolbarReducedSpacing,
          editorView: editorView,
          containerElement: containerElement,
          dispatchAnalyticsEvent: dispatchAnalyticsEvent,
          takeFullWidth: props.takeFullWidth
        });
      }
    }
  };
};

exports.findReplacePlugin = findReplacePlugin;
var _default = findReplacePlugin;
exports.default = _default;