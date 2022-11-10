"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alignmentWrapper = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _constants = require("@atlaskit/theme/constants");

var _templateObject;

var alignmentWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  padding: 0 ", "px;\n  display: flex;\n  flex-wrap: wrap;\n  max-width: ", "px;\n"])), (0, _constants.gridSize)(), 3 * 32);
exports.alignmentWrapper = alignmentWrapper;