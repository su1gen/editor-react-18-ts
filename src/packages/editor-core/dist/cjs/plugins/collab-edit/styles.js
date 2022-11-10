"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.telepointerStyle = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _pluginState = require("./plugin-state");

var _utils = require("./utils");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var telepointerColorStyle = function telepointerColorStyle(color, index) {
  return "\n  &.color-".concat(index, " {\n    background-color: ").concat(color.selection, ";\n    &::after {\n      background-color: ").concat(color.solid, ";\n      color: ").concat((0, _tokens.token)('color.text.inverse', '#fff'), ";\n      border-color: ").concat(color.solid, ";\n    }\n  }\n");
};

var telepointerStyle = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .ProseMirror .telepointer {\n    position: relative;\n    transition: opacity 200ms;\n\n    &.telepointer-selection {\n      line-height: 1.2;\n      pointer-events: none;\n      user-select: none;\n    }\n\n    &.telepointer-selection-badge::after {\n      content: attr(data-initial);\n      position: absolute;\n      display: block;\n      top: -14px;\n      font-size: ", ";\n      padding: 2px;\n      color: ", ";\n      left: -1px;\n      border-radius: 2px 2px 2px 0;\n      line-height: initial;\n    }\n\n    &.", " {\n      opacity: 0.2;\n    }\n\n    ", ";\n  }\n"])), (0, _editorSharedStyles.relativeFontSizeToBase16)(9), (0, _tokens.token)('color.text.inverse', 'white'), _pluginState.TELEPOINTER_DIM_CLASS, _utils.colors.map(function (color, index) {
  return telepointerColorStyle(color, index);
}));
exports.telepointerStyle = telepointerStyle;