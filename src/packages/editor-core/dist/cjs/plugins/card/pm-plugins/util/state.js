"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPluginStateWithUpdatedPos = exports.getPluginState = exports.getNewRequests = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _pluginKey = require("../plugin-key");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

// ============================================================================ //
// ============================== PLUGIN STATE ================================ //
// ============================================================================ //
// Used for interactions with the Card Plugin's state.
// ============================================================================ //
var getPluginState = function getPluginState(editorState) {
  return _pluginKey.pluginKey.getState(editorState);
};

exports.getPluginState = getPluginState;

var getPluginStateWithUpdatedPos = function getPluginStateWithUpdatedPos(pluginState, tr) {
  return _objectSpread(_objectSpread({}, pluginState), {}, {
    requests: pluginState.requests.map(function (request) {
      return _objectSpread(_objectSpread({}, request), {}, {
        pos: tr.mapping.map(request.pos)
      });
    }),
    cards: pluginState.cards.map(function (card) {
      return _objectSpread(_objectSpread({}, card), {}, {
        pos: tr.mapping.map(card.pos)
      });
    })
  });
};

exports.getPluginStateWithUpdatedPos = getPluginStateWithUpdatedPos;

var getNewRequests = function getNewRequests(oldState, currentState) {
  if (oldState) {
    return currentState.requests.filter(function (req) {
      return !oldState.requests.find(function (oldReq) {
        return isSameRequest(oldReq, req);
      });
    });
  }

  return currentState.requests;
};

exports.getNewRequests = getNewRequests;

var isSameRequest = function isSameRequest(requestA, requestB) {
  return requestA.url === requestB.url && requestA.pos === requestB.pos;
};