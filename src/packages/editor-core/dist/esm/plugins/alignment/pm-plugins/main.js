import _defineProperty from "@babel/runtime/helpers/defineProperty";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { isAlignable } from '../commands';
import { getActiveAlignment } from '../utils';
export function createInitialPluginState(editorState, pluginConfig) {
  return {
    align: getActiveAlignment(editorState) || pluginConfig.align,
    isEnabled: true
  };
}
export var pluginKey = new PluginKey('alignmentPlugin');
export function createPlugin(dispatch, pluginConfig) {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init: function init(_config, editorState) {
        return createInitialPluginState(editorState, pluginConfig);
      },
      apply: function apply(_tr, state, _prevState, nextState) {
        var nextPluginState = getActiveAlignment(nextState);
        var isEnabled = isAlignable(nextPluginState)(nextState);

        var newState = _objectSpread(_objectSpread({}, state), {}, {
          align: nextPluginState,
          isEnabled: isEnabled
        });

        if (nextPluginState !== state.align || isEnabled !== state.isEnabled) {
          dispatch(pluginKey, newState);
        }

        return newState;
      }
    }
  });
}