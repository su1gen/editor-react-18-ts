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

var _default = function _default(state, action) {
  switch (action.type) {
    case _actions.MediaLinkingActionsTypes.showToolbar:
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          visible: true
        });
      }

    case _actions.MediaLinkingActionsTypes.setUrl:
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          editable: true,
          link: action.payload
        });
      }

    case _actions.MediaLinkingActionsTypes.hideToolbar:
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          visible: false
        });
      }

    case _actions.MediaLinkingActionsTypes.unlink:
      {
        return _objectSpread(_objectSpread({}, state), {}, {
          link: '',
          visible: false,
          editable: false
        });
      }
  }

  return state;
};

exports.default = _default;