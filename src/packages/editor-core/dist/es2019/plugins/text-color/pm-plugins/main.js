import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { textColorPaletteExtended } from '../../../ui/ColorPalette/Palettes/textColorPalette';
import { DEFAULT_BORDER_COLOR } from '../../../ui/ColorPalette/Palettes/common';
import { DEFAULT_COLOR, getActiveColor } from '../utils/color';
import { getDisabledState } from '../utils/disabled';
export { DEFAULT_COLOR } from '../utils/color';
export function createInitialPluginState(editorState, pluginConfig) {
  const defaultColor = (pluginConfig === null || pluginConfig === void 0 ? void 0 : pluginConfig.defaultColor) || DEFAULT_COLOR;
  const palette = [{
    value: defaultColor.color,
    label: defaultColor.label,
    border: DEFAULT_BORDER_COLOR
  }, ...textColorPaletteExtended];
  const state = {
    color: getActiveColor(editorState),
    disabled: getDisabledState(editorState),
    palette,
    defaultColor: defaultColor.color
  };
  return state;
}
export let ACTIONS;

(function (ACTIONS) {
  ACTIONS[ACTIONS["RESET_COLOR"] = 0] = "RESET_COLOR";
  ACTIONS[ACTIONS["SET_COLOR"] = 1] = "SET_COLOR";
  ACTIONS[ACTIONS["DISABLE"] = 2] = "DISABLE";
})(ACTIONS || (ACTIONS = {}));

export const pluginKey = new PluginKey('textColorPlugin');
export function createPlugin(dispatch, pluginConfig) {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init(_config, editorState) {
        return createInitialPluginState(editorState, pluginConfig);
      },

      apply(tr, pluginState, _, newState) {
        const meta = tr.getMeta(pluginKey) || {};
        let nextState;

        switch (meta.action) {
          case ACTIONS.RESET_COLOR:
            nextState = { ...pluginState,
              color: pluginState.defaultColor
            };
            break;

          case ACTIONS.SET_COLOR:
            nextState = { ...pluginState,
              color: meta.color,
              disabled: false
            };
            break;

          case ACTIONS.DISABLE:
            nextState = { ...pluginState,
              disabled: true
            };
            break;

          default:
            nextState = { ...pluginState,
              color: getActiveColor(newState),
              disabled: getDisabledState(newState)
            };
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