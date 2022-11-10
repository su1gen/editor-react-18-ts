"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropdown = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _templateObject;

var dropdown = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: column;\n  background: ", ";\n  border-radius: ", "px;\n  box-shadow: ", ";\n  box-sizing: border-box;\n  padding: 4px 0;\n"])), (0, _tokens.token)('elevation.surface.overlay', 'white'), (0, _constants.borderRadius)(), (0, _tokens.token)('elevation.shadow.overlay', "0 4px 8px -2px ".concat(_colors.N60A, ", 0 0 1px ").concat(_colors.N60A)));
exports.dropdown = dropdown;