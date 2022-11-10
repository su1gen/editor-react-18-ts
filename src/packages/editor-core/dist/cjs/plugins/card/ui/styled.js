"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.embedSpacingStyles = exports.embedCardStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _templateObject, _templateObject2;

var embedCardStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .ProseMirror {\n    .embedCardView-content-wrap[layout^='wrap-'] {\n      max-width: 100%;\n    }\n\n    .embedCardView-content-wrap[layout='wrap-left'] {\n      float: left;\n    }\n\n    .embedCardView-content-wrap[layout='wrap-right'] {\n      float: right;\n    }\n\n    .embedCardView-content-wrap[layout='wrap-right']\n      + .embedCardView-content-wrap[layout='wrap-left'] {\n      clear: both;\n    }\n  }\n"])));
exports.embedCardStyles = embedCardStyles;
var embedSpacingStyles = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  margin: 0 10px;\n"])));
exports.embedSpacingStyles = embedSpacingStyles;