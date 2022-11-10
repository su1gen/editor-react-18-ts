"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fakeCursorStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var fakeCursorStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .ProseMirror {\n    .ProseMirror-fake-text-cursor {\n      display: inline;\n      pointer-events: none;\n      position: relative;\n    }\n\n    .ProseMirror-fake-text-cursor::after {\n      content: '';\n      display: inline;\n      top: 0;\n      position: absolute;\n      border-right: 1px solid ", ";\n    }\n\n    .ProseMirror-fake-text-selection {\n      display: inline;\n      pointer-events: none;\n      position: relative;\n      background-color: ", ";\n    }\n  }\n"])), (0, _tokens.token)('color.border', 'rgba(0, 0, 0, 0.4)'), (0, _tokens.token)('color.background.selected', _colors.B75));
exports.fakeCursorStyles = fakeCursorStyles;