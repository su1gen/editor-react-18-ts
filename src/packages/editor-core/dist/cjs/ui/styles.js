"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.expandIconWrapperStyle = exports.dropShadow = exports.clickSelectWrapperStyle = exports.cellColourPreviewStyles = exports.buttonGroupStyle = exports.buttonContentStyle = exports.buttonContentReducedSpacingStyle = void 0;
Object.defineProperty(exports, "scrollbarStyles", {
  enumerable: true,
  get: function get() {
    return _scrollbar.scrollbarStyles;
  }
});
exports.separatorStyles = void 0;
Object.defineProperty(exports, "shortcutStyle", {
  enumerable: true,
  get: function get() {
    return _shortcut.shortcutStyle;
  }
});
exports.wrapperStyle = exports.wrapperSmallStyle = exports.triggerWrapperStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _shortcut = require("@atlaskit/editor-shared-styles/shortcut");

var _scrollbar = require("@atlaskit/editor-shared-styles/scrollbar");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6, _templateObject7, _templateObject8, _templateObject9, _templateObject10, _templateObject11;

// TODO ED-15449 delete this style when deleting editor-core table
var cellColourPreviewStyles = function cellColourPreviewStyles(selectedColor) {
  return (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  &::before {\n    background: ", ";\n  }\n"])), selectedColor);
};

exports.cellColourPreviewStyles = cellColourPreviewStyles;
var buttonGroupStyle = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  display: inline-flex;\n  align-items: center;\n\n  & > div {\n    display: flex;\n  }\n"])));
exports.buttonGroupStyle = buttonGroupStyle;
var separatorStyles = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  background: ", ";\n  width: 1px;\n  height: 24px;\n  display: inline-block;\n  margin: 0 8px;\n"])), (0, _tokens.token)('color.border', _colors.N30));
exports.separatorStyles = separatorStyles;
var wrapperStyle = (0, _react.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  align-items: center;\n\n  > div,\n  > span {\n    display: flex;\n  }\n\n  > div > div {\n    display: flex;\n  }\n\n  margin-left: 0;\n  min-width: auto;\n"])));
exports.wrapperStyle = wrapperStyle;
var wrapperSmallStyle = (0, _react.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  margin-left: 4px;\n  min-width: 40px;\n"])));
exports.wrapperSmallStyle = wrapperSmallStyle;
var expandIconWrapperStyle = (0, _react.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  margin-left: -8px;\n"])));
exports.expandIconWrapperStyle = expandIconWrapperStyle;
var triggerWrapperStyles = (0, _react.css)(_templateObject7 || (_templateObject7 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n"])));
exports.triggerWrapperStyles = triggerWrapperStyles;
var buttonContentStyle = (0, _react.css)(_templateObject8 || (_templateObject8 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  min-width: 80px;\n  align-items: center;\n  overflow: hidden;\n  justify-content: center;\n  flex-direction: column;\n  padding: 6px;\n"])));
exports.buttonContentStyle = buttonContentStyle;
var buttonContentReducedSpacingStyle = (0, _react.css)(_templateObject9 || (_templateObject9 = (0, _taggedTemplateLiteral2.default)(["\n  padding: 8px;\n"]))); // Taken from the style of inline dialog components

exports.buttonContentReducedSpacingStyle = buttonContentReducedSpacingStyle;
var dropShadow = (0, _react.css)(_templateObject10 || (_templateObject10 = (0, _taggedTemplateLiteral2.default)(["\n  box-shadow: ", ";\n"])), (0, _tokens.token)('elevation.shadow.overlay', "0 0 1px rgba(9, 30, 66, 0.31),\n    0 4px 8px -2px rgba(9, 30, 66, 0.25)"));
exports.dropShadow = dropShadow;
var clickSelectWrapperStyle = (0, _react.css)(_templateObject11 || (_templateObject11 = (0, _taggedTemplateLiteral2.default)(["\n  user-select: all;\n"])));
exports.clickSelectWrapperStyle = clickSelectWrapperStyle;