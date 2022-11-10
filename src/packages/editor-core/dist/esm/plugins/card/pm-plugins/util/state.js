import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { pluginKey } from '../plugin-key'; // ============================================================================ //
// ============================== PLUGIN STATE ================================ //
// ============================================================================ //
// Used for interactions with the Card Plugin's state.
// ============================================================================ //

export var getPluginState = function getPluginState(editorState) {
  return pluginKey.getState(editorState);
};
export var getPluginStateWithUpdatedPos = function getPluginStateWithUpdatedPos(pluginState, tr) {
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
export var getNewRequests = function getNewRequests(oldState, currentState) {
  if (oldState) {
    return currentState.requests.filter(function (req) {
      return !oldState.requests.find(function (oldReq) {
        return isSameRequest(oldReq, req);
      });
    });
  }

  return currentState.requests;
};

var isSameRequest = function isSameRequest(requestA, requestB) {
  return requestA.url === requestB.url && requestA.pos === requestB.pos;
};