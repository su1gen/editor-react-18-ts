"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMenuState = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _react = require("react");

var useMenuState = function useMenuState() {
  var _useState = (0, _react.useState)(false),
      _useState2 = (0, _slicedToArray2.default)(_useState, 2),
      isMenuOpen = _useState2[0],
      setIsMenuOpened = _useState2[1];

  var toggleMenu = (0, _react.useCallback)(function () {
    setIsMenuOpened(!isMenuOpen);
  }, [isMenuOpen]);
  var closeMenu = (0, _react.useCallback)(function () {
    setIsMenuOpened(false);
  }, []);
  return [isMenuOpen, toggleMenu, closeMenu];
};

exports.useMenuState = useMenuState;