"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPluginState = exports.createPluginState = exports.createCommand = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _pluginStateFactory = require("../../utils/plugin-state-factory");

var _reducer = _interopRequireDefault(require("./reducer"));

var _pluginKey = require("./plugin-key");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var factory = (0, _pluginStateFactory.pluginFactory)(_pluginKey.pluginKey, _reducer.default, {
  mapping: function mapping(tr, state) {
    var _ref = state,
        previousPositions = _ref.positions;

    if (!previousPositions) {
      return state;
    }

    var positions = _objectSpread({}, previousPositions);

    for (var key in positions) {
      positions[key] = tr.mapping.map(positions[key]);
    }

    return _objectSpread(_objectSpread({}, state), {}, {
      positions: positions
    });
  }
});
var createPluginState = factory.createPluginState;
exports.createPluginState = createPluginState;
var createCommand = factory.createCommand;
exports.createCommand = createCommand;
var getPluginState = factory.getPluginState;
exports.getPluginState = getPluginState;