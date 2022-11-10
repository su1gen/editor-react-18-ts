"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BeforePrimaryToolbarWrapper = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _templateObject;

var beforePrimaryToolbarPluginWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  margin-right: 8px;\n  flex-grow: 1;\n  justify-content: flex-end;\n  align-items: center;\n"])));

var BeforePrimaryToolbarWrapper = function BeforePrimaryToolbarWrapper(props) {
  return (0, _react.jsx)("div", {
    css: beforePrimaryToolbarPluginWrapper,
    "data-testid": 'before-primary-toolbar-components-plugin'
  }, props.beforePrimaryToolbarComponents);
};

exports.BeforePrimaryToolbarWrapper = BeforePrimaryToolbarWrapper;