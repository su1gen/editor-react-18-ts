"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.figureWrapper = exports.MediaSingleNodeSelector = exports.MediaInlineNodeSelector = exports.MediaCardWrapper = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@emotion/react");

var _templateObject, _templateObject2, _templateObject3;

var MediaInlineNodeSelector = 'media-inline-node';
exports.MediaInlineNodeSelector = MediaInlineNodeSelector;
var MediaSingleNodeSelector = 'media-single-node';
exports.MediaSingleNodeSelector = MediaSingleNodeSelector;
var figureWrapper = (0, _react2.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  margin: 0;\n"])));
exports.figureWrapper = figureWrapper;
var absoluteDiv = (0, _react2.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  position: absolute;\n  width: 100%;\n  height: 100%;\n"])));
var forcedDimensions = (0, _react2.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  width: 100%;\n  position: relative;\n"])));

var MediaCardWrapper = function MediaCardWrapper(_ref) {
  var dimensions = _ref.dimensions,
      children = _ref.children,
      onContextMenu = _ref.onContextMenu;
  return (0, _react2.jsx)("div", {
    css: forcedDimensions,
    style: {
      paddingBottom: "".concat(dimensions.height / dimensions.width * 100, "%")
    },
    onContextMenuCapture: onContextMenu
  }, (0, _react2.jsx)("div", {
    css: absoluteDiv
  }, children));
};

exports.MediaCardWrapper = MediaCardWrapper;