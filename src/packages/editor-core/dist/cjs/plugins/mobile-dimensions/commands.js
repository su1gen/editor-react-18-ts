"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setWindowHeight = exports.setMobilePaddingTop = exports.setKeyboardHeight = exports.setIsExpanded = void 0;

var _actions = require("./actions");

var _pluginFactory = require("./plugin-factory");

var setKeyboardHeight = function setKeyboardHeight(keyboardHeight) {
  return (0, _pluginFactory.createCommand)({
    type: _actions.MobileDimensionsActionTypes.SET_KEYBOARD_HEIGHT,
    keyboardHeight: keyboardHeight
  });
};

exports.setKeyboardHeight = setKeyboardHeight;

var setWindowHeight = function setWindowHeight(windowHeight) {
  return (0, _pluginFactory.createCommand)({
    type: _actions.MobileDimensionsActionTypes.SET_WINDOW_HEIGHT,
    windowHeight: windowHeight
  });
};

exports.setWindowHeight = setWindowHeight;

var setMobilePaddingTop = function setMobilePaddingTop(paddingTop) {
  return (0, _pluginFactory.createCommand)({
    type: _actions.MobileDimensionsActionTypes.SET_MOBILE_PADDING_TOP,
    paddingTop: paddingTop
  });
};

exports.setMobilePaddingTop = setMobilePaddingTop;

var setIsExpanded = function setIsExpanded(isExpanded) {
  return (0, _pluginFactory.createCommand)({
    type: _actions.MobileDimensionsActionTypes.SET_IS_EXPANDED,
    isExpanded: isExpanded
  });
};

exports.setIsExpanded = setIsExpanded;