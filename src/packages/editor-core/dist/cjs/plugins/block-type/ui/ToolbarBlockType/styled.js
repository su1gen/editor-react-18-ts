"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.keyboardShortcutSelect = exports.keyboardShortcut = exports.blockTypeMenuItemStyle = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _styles = require("@atlaskit/editor-common/styles");

var _styles2 = require("../../../../ui/styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3;

var blockTypeMenuItemStyle = function blockTypeMenuItemStyle(tagName, selected) {
  // TEMP FIX: See https://product-fabric.atlassian.net/browse/ED-13878
  var selectedStyle = selected ? "".concat(tagName, " { color: ").concat((0, _tokens.token)('color.text', 'white'), " !important; }") : '';
  return function (themeProps) {
    return (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n    ", ";\n    > {\n      h1,\n      h2,\n      h3,\n      h4,\n      h5,\n      h6 {\n        margin-top: 0;\n      }\n    }\n    ", ";\n  "])), (0, _styles.headingsSharedStyles)(themeProps), selectedStyle);
  };
};

exports.blockTypeMenuItemStyle = blockTypeMenuItemStyle;
var keyboardShortcut = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  ", "\n  margin-left: 16px;\n"])), _styles2.shortcutStyle);
exports.keyboardShortcut = keyboardShortcut;
var keyboardShortcutSelect = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  color: ", ";\n"])), (0, _tokens.token)('color.icon', _colors.N400));
exports.keyboardShortcutSelect = keyboardShortcutSelect;