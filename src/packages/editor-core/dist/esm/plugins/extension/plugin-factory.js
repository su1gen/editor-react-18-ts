import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { pluginFactory } from '../../utils/plugin-state-factory';
import reducer from './reducer';
import { pluginKey } from './plugin-key';
var factory = pluginFactory(pluginKey, reducer, {
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
export var createPluginState = factory.createPluginState;
export var createCommand = factory.createCommand;
export var getPluginState = factory.getPluginState;