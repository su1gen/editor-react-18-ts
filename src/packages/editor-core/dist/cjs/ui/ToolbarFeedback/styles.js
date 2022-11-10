"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapper = exports.confirmationText = exports.confirmationPopup = exports.confirmationImg = exports.confirmationHeader = exports.buttonContent = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _constants = require("@atlaskit/theme/constants");

var _colors = require("@atlaskit/theme/colors");

var _tokens = require("@atlaskit/tokens");

var _editorSharedStyles = require("@atlaskit/editor-shared-styles");

var _templateObject, _templateObject2, _templateObject3, _templateObject4, _templateObject5, _templateObject6;

var buttonContent = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  height: 24px;\n  line-height: 24px;\n  min-width: 70px;\n"])));
exports.buttonContent = buttonContent;
var wrapper = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  margin-right: 0;\n"])));
exports.wrapper = wrapper;
var confirmationPopup = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  background: ", ";\n  border-radius: ", "px;\n  box-shadow: ", ";\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  overflow: auto;\n  max-height: none;\n  height: 410px;\n  width: 280px;\n"])), (0, _tokens.token)('elevation.surface.overlay', '#fff'), (0, _constants.borderRadius)(), (0, _tokens.token)('elevation.shadow.overlay', "0 4px 8px -2px ".concat(_colors.N60A, ", 0 0 1px ").concat(_colors.N60A)));
exports.confirmationPopup = confirmationPopup;
var confirmationText = (0, _react.css)(_templateObject4 || (_templateObject4 = (0, _taggedTemplateLiteral2.default)(["\n  font-size: ", ";\n  word-spacing: 4px;\n  line-height: 22px;\n  color: ", ";\n  margin-top: 30px;\n  padding: 20px;\n  & > div {\n    width: 240px;\n  }\n  & > div:first-of-type {\n    margin-bottom: 12px;\n  }\n  & > div:nth-of-type(2) {\n    margin-bottom: 20px;\n  }\n"])), (0, _editorSharedStyles.relativeFontSizeToBase16)(14), (0, _tokens.token)('color.text.subtle', _colors.N400));
exports.confirmationText = confirmationText;
var confirmationHeader = (0, _react.css)(_templateObject5 || (_templateObject5 = (0, _taggedTemplateLiteral2.default)(["\n  background-color: ", ";\n  height: 100px;\n  width: 100%;\n  display: inline-block;\n"])), (0, _tokens.token)('color.background.discovery.bold', _colors.P400));
exports.confirmationHeader = confirmationHeader;
var confirmationImg = (0, _react.css)(_templateObject6 || (_templateObject6 = (0, _taggedTemplateLiteral2.default)(["\n  width: 100px;\n  display: block;\n  margin: 25px auto 0 auto;\n"])));
exports.confirmationImg = confirmationImg;