"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.visuallyHiddenStyles = exports.linkStyles = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _styles = require("@atlaskit/editor-common/styles");

var _templateObject, _templateObject2;

var linkStyles = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  .ProseMirror {\n    ", "\n  }\n"])), _styles.linkSharedStyle);
/**
 * Visible only to screenreaders. Use when there is a need
 * to provide more context to a non-sighted user.
 */

exports.linkStyles = linkStyles;
var visuallyHiddenStyles = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  clip: rect(1px, 1px, 1px, 1px);\n  clip-path: inset(50%);\n  height: 1px;\n  width: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n"])));
exports.visuallyHiddenStyles = visuallyHiddenStyles;