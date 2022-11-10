import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _slicedToArray from "@babel/runtime/helpers/slicedToArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { PluginKey } from 'prosemirror-state';
import { pluginFactory } from '../../../utils/plugin-state-factory';
import { reducer } from '../reducer';
export var pluginKey = new PluginKey('pastePlugin');

var _pluginFactory = pluginFactory(pluginKey, reducer, {
  mapping: function mapping(tr, pluginState) {
    if (tr.docChanged) {
      var atLeastOnePositionChanged = false;
      var positionsMappedThroughChanges = Object.entries(pluginState.pastedMacroPositions).reduce(function (acc, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            position = _ref2[1];

        var mappedPosition = tr.mapping.map(position);

        if (position !== mappedPosition) {
          atLeastOnePositionChanged = true;
        }

        acc[key] = tr.mapping.map(position);
        return acc;
      }, {});

      if (atLeastOnePositionChanged) {
        return _objectSpread(_objectSpread({}, pluginState), {}, {
          pastedMacroPositions: positionsMappedThroughChanges
        });
      }
    }

    return pluginState;
  }
}),
    createPluginState = _pluginFactory.createPluginState,
    createCommand = _pluginFactory.createCommand,
    getPluginState = _pluginFactory.getPluginState;

export { createPluginState, createCommand, getPluginState };