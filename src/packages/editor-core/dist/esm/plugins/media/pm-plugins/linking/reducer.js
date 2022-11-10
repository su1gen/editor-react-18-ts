import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { MediaLinkingActionsTypes } from './actions';
export default (function (state, action) {
  switch (action.type) {
    case MediaLinkingActionsTypes.showToolbar:
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          visible: true
        });
      }

    case MediaLinkingActionsTypes.setUrl:
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          editable: true,
          link: action.payload
        });
      }

    case MediaLinkingActionsTypes.hideToolbar:
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          visible: false
        });
      }

    case MediaLinkingActionsTypes.unlink:
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          link: '',
          visible: false,
          editable: false
        });
      }
  }

  return state;
});