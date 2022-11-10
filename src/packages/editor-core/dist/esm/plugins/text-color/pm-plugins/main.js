import _defineProperty from "@babel/runtime/helpers/defineProperty";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { textColorPaletteExtended } from '../../../ui/ColorPalette/Palettes/textColorPalette';
import { DEFAULT_BORDER_COLOR } from '../../../ui/ColorPalette/Palettes/common';
import { DEFAULT_COLOR, getActiveColor } from '../utils/color';
import { getDisabledState } from '../utils/disabled';
export { DEFAULT_COLOR } from '../utils/color';
export function createInitialPluginState(editorState, pluginConfig) {
  var defaultColor = (pluginConfig === null || pluginConfig === void 0 ? void 0 : pluginConfig.defaultColor) || DEFAULT_COLOR;
  var palette = [{
    value: defaultColor.color,
    label: defaultColor.label,
    border: DEFAULT_BORDER_COLOR
  }].concat(_toConsumableArray(textColorPaletteExtended));
  var state = {
    color: getActiveColor(editorState),
    disabled: getDisabledState(editorState),
    palette: palette,
    defaultColor: defaultColor.color
  };
  return state;
}
export var ACTIONS;

(function (ACTIONS) {
  ACTIONS[ACTIONS["RESET_COLOR"] = 0] = "RESET_COLOR";
  ACTIONS[ACTIONS["SET_COLOR"] = 1] = "SET_COLOR";
  ACTIONS[ACTIONS["DISABLE"] = 2] = "DISABLE";
})(ACTIONS || (ACTIONS = {}));

export var pluginKey = new PluginKey('textColorPlugin');
export function createPlugin(dispatch, pluginConfig) {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init: function init(_config, editorState) {
        return createInitialPluginState(editorState, pluginConfig);
      },
      apply: function apply(tr, pluginState, _, newState) {
        var meta = tr.getMeta(pluginKey) || {};
        var nextState;

        switch (meta.action) {
          case ACTIONS.RESET_COLOR:
            nextState = _objectSpread(_objectSpread({}, pluginState), {}, {
              color: pluginState.defaultColor
            });
            break;

          case ACTIONS.SET_COLOR:
            nextState = _objectSpread(_objectSpread({}, pluginState), {}, {
              color: meta.color,
              disabled: false
            });
            break;

          case ACTIONS.DISABLE:
            nextState = _objectSpread(_objectSpread({}, pluginState), {}, {
              disabled: true
            });
            break;

          default:
            nextState = _objectSpread(_objectSpread({}, pluginState), {}, {
              color: getActiveColor(newState),
              disabled: getDisabledState(newState)
            });
        }

        if (pluginState && pluginState.color !== nextState.color || pluginState && pluginState.disabled !== nextState.disabled) {
          dispatch(pluginKey, nextState);
          return nextState;
        }

        return pluginState;
      }
    }
  });
}