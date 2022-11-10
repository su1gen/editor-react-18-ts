import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { MobileDimensionsActionTypes } from './actions';
export default function (state, action) {
  switch (action.type) {
    case MobileDimensionsActionTypes.SET_KEYBOARD_HEIGHT:
      return _objectSpread(_objectSpread({}, state), {}, {
        keyboardHeight: action.keyboardHeight
      });

    case MobileDimensionsActionTypes.SET_WINDOW_HEIGHT:
      return _objectSpread(_objectSpread({}, state), {}, {
        windowHeight: action.windowHeight
      });

    case MobileDimensionsActionTypes.SET_MOBILE_PADDING_TOP:
      return _objectSpread(_objectSpread({}, state), {}, {
        mobilePaddingTop: action.paddingTop
      });

    case MobileDimensionsActionTypes.SET_IS_EXPANDED:
      return _objectSpread(_objectSpread({}, state), {}, {
        isExpanded: action.isExpanded
      });
  }

  return state;
}