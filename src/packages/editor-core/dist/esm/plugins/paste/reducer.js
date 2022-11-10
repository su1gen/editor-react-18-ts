import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { PastePluginActionTypes as ActionTypes } from './actions';
export var reducer = function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.START_TRACKING_PASTED_MACRO_POSITIONS:
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          pastedMacroPositions: _objectSpread(_objectSpread({}, state.pastedMacroPositions), action.pastedMacroPositions)
        });
      }

    case ActionTypes.STOP_TRACKING_PASTED_MACRO_POSITIONS:
      {
        var filteredMacroPositions = Object.fromEntries(Object.entries(state.pastedMacroPositions).filter(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 1),
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