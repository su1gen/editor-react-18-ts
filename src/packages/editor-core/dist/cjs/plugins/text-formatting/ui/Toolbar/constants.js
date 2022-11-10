"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResponsiveCustomMenu = exports.ResponsiveCustomButtonToolbar = exports.DefaultButtonsToolbar = exports.DefaultButtonsMenu = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _types = require("../../../../ui/Toolbar/types");

var _types2 = require("./types");

var _ResponsiveCustomButt, _ResponsiveCustomMenu;

var DefaultButtonsToolbar = [_types2.IconTypes.strong, _types2.IconTypes.em];
exports.DefaultButtonsToolbar = DefaultButtonsToolbar;
var DefaultButtonsMenu = [_types2.IconTypes.underline, _types2.IconTypes.strike, _types2.IconTypes.code, _types2.IconTypes.subscript, _types2.IconTypes.superscript];
exports.DefaultButtonsMenu = DefaultButtonsMenu;
var ResponsiveCustomButtonToolbar = (_ResponsiveCustomButt = {}, (0, _defineProperty2.default)(_ResponsiveCustomButt, _types.ToolbarSize.XXL, DefaultButtonsToolbar), (0, _defineProperty2.default)(_ResponsiveCustomButt, _types.ToolbarSize.XL, DefaultButtonsToolbar), (0, _defineProperty2.default)(_ResponsiveCustomButt, _types.ToolbarSize.L, DefaultButtonsToolbar), (0, _defineProperty2.default)(_ResponsiveCustomButt, _types.ToolbarSize.M, []), (0, _defineProperty2.default)(_ResponsiveCustomButt, _types.ToolbarSize.S, []), (0, _defineProperty2.default)(_ResponsiveCustomButt, _types.ToolbarSize.XXXS, []), _ResponsiveCustomButt);
exports.ResponsiveCustomButtonToolbar = ResponsiveCustomButtonToolbar;
var ResponsiveCustomMenu = (_ResponsiveCustomMenu = {}, (0, _defineProperty2.default)(_ResponsiveCustomMenu, _types.ToolbarSize.XXL, DefaultButtonsMenu), (0, _defineProperty2.default)(_ResponsiveCustomMenu, _types.ToolbarSize.XL, DefaultButtonsMenu), (0, _defineProperty2.default)(_ResponsiveCustomMenu, _types.ToolbarSize.L, DefaultButtonsMenu), (0, _defineProperty2.default)(_ResponsiveCustomMenu, _types.ToolbarSize.M, [_types2.IconTypes.strong, _types2.IconTypes.em].concat(DefaultButtonsMenu)), (0, _defineProperty2.default)(_ResponsiveCustomMenu, _types.ToolbarSize.S, [_types2.IconTypes.strong, _types2.IconTypes.em].concat(DefaultButtonsMenu)), (0, _defineProperty2.default)(_ResponsiveCustomMenu, _types.ToolbarSize.XXXS, [_types2.IconTypes.strong, _types2.IconTypes.em].concat(DefaultButtonsMenu)), _ResponsiveCustomMenu);
exports.ResponsiveCustomMenu = ResponsiveCustomMenu;