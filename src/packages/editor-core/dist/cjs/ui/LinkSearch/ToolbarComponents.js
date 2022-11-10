"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inputWrapper = exports.containerWithProvider = exports.container = exports.RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX = exports.RECENT_SEARCH_WIDTH_IN_PX = exports.RECENT_SEARCH_HEIGHT_IN_PX = void 0;

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _react = require("@emotion/react");

var _templateObject, _templateObject2, _templateObject3;

var RECENT_SEARCH_WIDTH_IN_PX = 420;
exports.RECENT_SEARCH_WIDTH_IN_PX = RECENT_SEARCH_WIDTH_IN_PX;
var RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX = 360;
exports.RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX = RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX;
var RECENT_SEARCH_HEIGHT_IN_PX = 360;
exports.RECENT_SEARCH_HEIGHT_IN_PX = RECENT_SEARCH_HEIGHT_IN_PX;
var inputWrapper = (0, _react.css)(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  line-height: 0;\n  padding: 5px 0;\n  align-items: center;\n"])));
exports.inputWrapper = inputWrapper;
var container = (0, _react.css)(_templateObject2 || (_templateObject2 = (0, _taggedTemplateLiteral2.default)(["\n  display: flex;\n  flex-direction: column;\n  overflow: auto;\n  padding: 0;\n\n  width: ", "px;\n  line-height: initial;\n"])), RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX);
exports.container = container;
var containerWithProvider = (0, _react.css)(_templateObject3 || (_templateObject3 = (0, _taggedTemplateLiteral2.default)(["\n  width: ", "px;\n"])), RECENT_SEARCH_WIDTH_IN_PX);
exports.containerWithProvider = containerWithProvider;