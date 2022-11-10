"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _actions = require("./actions");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var reducer = function reducer(getInitialState) {
  return function (state, action) {
    switch (action.type) {
      case _actions.FindReplaceActionTypes.ACTIVATE:
      case _actions.FindReplaceActionTypes.FIND:
        return _objectSpread(_objectSpread({}, state), {}, {
          isActive: true,
          shouldFocus: action.type === _actions.FindReplaceActionTypes.ACTIVATE,
          findText: action.findText !== undefined ? action.findText : state.findText,
          matches: action.matches || state.matches,
          index: action.index !== undefined ? action.index : state.index
        });

      case _actions.FindReplaceActionTypes.UPDATE_DECORATIONS:
        return _objectSpread(_objectSpread({}, state), {}, {
          decorationSet: action.decorationSet
        });

      case _actions.FindReplaceActionTypes.FIND_NEXT:
        return _objectSpread(_objectSpread({}, state), {}, {
          index: action.index,
          decorationSet: action.decorationSet
        });

      case _actions.FindReplaceActionTypes.FIND_PREVIOUS:
        return _objectSpread(_objectSpread({}, state), {}, {
          index: action.index,
          decorationSet: action.decorationSet
        });

      case _actions.FindReplaceActionTypes.REPLACE:
      case _actions.FindReplaceActionTypes.REPLACE_ALL:
        return _objectSpread(_objectSpread({}, state), {}, {
          replaceText: action.replaceText,
          decorationSet: action.decorationSet,
          matches: action.matches,
          index: action.index
        });

      case _actions.FindReplaceActionTypes.CANCEL:
        return getInitialState();

      case _actions.FindReplaceActionTypes.BLUR:
        return _objectSpread(_objectSpread({}, state), {}, {
          shouldFocus: false
        });

      case _actions.FindReplaceActionTypes.TOGGLE_MATCH_CASE:
        return _objectSpread(_objectSpread({}, state), {}, {
          shouldMatchCase: !state.shouldMatchCase
        });

      default:
        return state;
    }
  };
};

var _default = reducer;
exports.default = _default;