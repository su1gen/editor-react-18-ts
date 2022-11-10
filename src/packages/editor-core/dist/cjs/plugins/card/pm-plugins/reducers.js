"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var queue = function queue(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    requests: state.requests.concat(action.requests)
  });
};

var resolve = function resolve(state, action) {
  var requests = state.requests.reduce(function (requests, request) {
    if (request.url !== action.url) {
      requests.push(request);
    }

    return requests;
  }, []);
  return _objectSpread(_objectSpread({}, state), {}, {
    requests: requests
  });
};

var register = function register(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    cards: state.cards.filter(function (card) {
      return card.pos !== action.info.pos;
    }).concat(action.info)
  });
};

var setProvider = function setProvider(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    provider: action.provider
  });
};

var registerEvents = function registerEvents(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    smartLinkEvents: action.smartLinkEvents
  });
};

var setLinkToolbar = function setLinkToolbar(state, action) {
  return _objectSpread(_objectSpread({}, state), {}, {
    showLinkingToolbar: action.type === 'SHOW_LINK_TOOLBAR'
  });
};

var _default = function _default(state, action) {
  switch (action.type) {
    case 'QUEUE':
      return queue(state, action);

    case 'SET_PROVIDER':
      return setProvider(state, action);

    case 'RESOLVE':
      return resolve(state, action);

    case 'REGISTER':
      return register(state, action);

    case 'REGISTER_EVENTS':
      return registerEvents(state, action);

    case 'SHOW_LINK_TOOLBAR':
    case 'HIDE_LINK_TOOLBAR':
      return setLinkToolbar(state, action);
  }
};

exports.default = _default;