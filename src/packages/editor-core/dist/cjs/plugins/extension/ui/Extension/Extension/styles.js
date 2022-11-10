"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapperStyle = exports.widerLayoutClassName = exports.header = exports.contentWrapper = exports.content = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _components = require("@atlaskit/theme/components");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _styles = require("../styles");

var _tokens = require("@atlaskit/tokens");

var _templateObject, _templateObject2, _templateObject3, _templateObject4;

var widerLayoutClassName = 'wider-layout';
exports.widerLayoutClassName = widerLayoutClassName;

var wrapperStyle = function wrapperStyle(theme) {
  return (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  ", "\n\n  &.without-frame {\n    background: transparent;\n  }\n  cursor: pointer;\n  width: 100%;\n\n  .extension-overflow-wrapper:not(.with-body) {\n    overflow-x: auto;\n  }\n"])), (0, _styles.wrapperDefault)(theme));
};

exports.wrapperStyle = wrapperStyle;
var header = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  padding: ", "px ", "px 0px;\n  vertical-align: middle;\n\n  &.with-children:not(.without-frame) {\n    padding: 4px 8px 8px;\n  }\n  &.without-frame {\n    padding: 0;\n  }\n"])), _styles.padding / 2, _styles.padding / 2);
exports.header = header;

var content = function content(theme) {
  return (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  padding: ", "px;\n  background: ", ";\n  color: ", ";\n  border: 1px solid ", ";\n  border-radius: ", "px;\n  cursor: initial;\n"])), _styles.padding, (0, _components.themed)({
    light: (0, _tokens.token)('elevation.surface', 'white'),
    dark: (0, _tokens.token)('elevation.surface', _colors.DN30)
  })(theme), (0, _components.themed)({
    dark: (0, _tokens.token)('color.text', _colors.DN900)
  })(theme), (0, _tokens.token)('color.border', _colors.N30), (0, _constants.borderRadius)());
};

exports.content = content;
var contentWrapper = (0, _react.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  padding: 0 ", "px ", "px;\n"])), _styles.padding, _styles.padding);
exports.contentWrapper = contentWrapper;