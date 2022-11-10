"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapperStyle = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _ui = require("@atlaskit/editor-common/ui");

var _templateObject;

var wrapperStyle = function wrapperStyle(props) {
  return (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  & > div {\n    ", ";\n    position: relative;\n    clear: both;\n\n    > div {\n      position: absolute;\n      height: 100%;\n      width: 100%;\n    }\n  }\n"])), (0, _ui.MediaSingleDimensionHelper)(props));
};

exports.wrapperStyle = wrapperStyle;