"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducer = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _actions = require("./actions");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var reducer = function reducer(state, action) {
  switch (action.type) {
    case _actions.PastePluginActionTypes.START_TRACKING_PASTED_MACRO_POSITIONS:
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          pastedMacroPositions: _objectSpread(_objectSpread({}, state.pastedMacroPositions), action.pastedMacroPositions)
        });
      }

    case _actions.PastePluginActionTypes.STOP_TRACKING_PASTED_MACRO_POSITIONS:
      {
        var filteredMacroPositions = Object.fromEntries(Object.entries(state.pastedMacroPositions).filter(function (_ref) {
          var _ref2 = (0, _slicedToArray2.default)(_ref, 1),
              key = _ref2[0];

          return !action.pastedMacroPositionKeys.includes(key);
        }));
        return _objectSpread(_objectSpread({}, state), {}, {
          pastedMacroPositions: filteredMacroPositions
        });
      }

    default:
      return state;
  }
};

exports.reducer = reducer;