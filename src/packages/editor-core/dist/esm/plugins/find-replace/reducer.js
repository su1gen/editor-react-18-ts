import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { FindReplaceActionTypes } from './actions';

var reducer = function reducer(getInitialState) {
  return function (state, action) {
    switch (action.type) {
      case FindReplaceActionTypes.ACTIVATE:
      case FindReplaceActionTypes.FIND:
        return _objectSpread(_objectSpread({}, state), {}, {
          isActive: true,
          shouldFocus: action.type === FindReplaceActionTypes.ACTIVATE,
          findText: action.findText !== undefined ? action.findText : state.findText,
          matches: action.matches || state.matches,
          index: action.index !== undefined ? action.index : state.index
        });

      case FindReplaceActionTypes.UPDATE_DECORATIONS:
        return _objectSpread(_objectSpread({}, state), {}, {
          decorationSet: action.decorationSet
        });

      case FindReplaceActionTypes.FIND_NEXT:
        return _objectSpread(_objectSpread({}, state), {}, {
          index: action.index,
          decorationSet: action.decorationSet
        });

      case FindReplaceActionTypes.FIND_PREVIOUS:
        return _objectSpread(_objectSpread({}, state), {}, {
          index: action.index,
          decorationSet: action.decorationSet
        });

      case FindReplaceActionTypes.REPLACE:
      case FindReplaceActionTypes.REPLACE_ALL:
        return _objectSpread(_objectSpread({}, state), {}, {
          replaceText: action.replaceText,
          decorationSet: action.decorationSet,
          matches: action.matches,
          index: action.index
        });

      case FindReplaceActionTypes.CANCEL:
        return getInitialState();

      case FindReplaceActionTypes.BLUR:
        return _objectSpread(_objectSpread({}, state), {}, {
          shouldFocus: false
        });

      case FindReplaceActionTypes.TOGGLE_MATCH_CASE:
        return _objectSpread(_objectSpread({}, state), {}, {
          shouldMatchCase: !state.shouldMatchCase
        });

      default:
        return state;
    }
  };
};

export default reducer;