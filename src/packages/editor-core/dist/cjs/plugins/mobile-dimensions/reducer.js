"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _actions = require("./actions");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _default(state, action) {
  switch (action.type) {
    case _actions.MobileDimensionsActionTypes.SET_KEYBOARD_HEIGHT:
      return _objectSpread(_objectSpread({}, state), {}, {
        keyboardHeight: action.keyboardHeight
      });

    case _actions.MobileDimensionsActionTypes.SET_WINDOW_HEIGHT:
      return _objectSpread(_objectSpread({}, state), {}, {
        windowHeight: action.windowHeight
      });

    case _actions.MobileDimensionsActionTypes.SET_MOBILE_PADDING_TOP:
      return _objectSpread(_objectSpread({}, state), {}, {
        mobilePaddingTop: action.paddingTop
      });

    case _actions.MobileDimensionsActionTypes.SET_IS_EXPANDED:
      return _objectSpread(_objectSpread({}, state), {}, {
        isExpanded: action.isExpanded
      });
  }

  return state;
}