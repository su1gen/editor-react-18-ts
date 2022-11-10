import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { checkFormattingIsPresent } from '../utils';
export const pluginKey = new PluginKey('clearFormattingPlugin');
export const plugin = dispatch => new SafePlugin({
  state: {
    init(_config, state) {
      return {
        formattingIsPresent: checkFormattingIsPresent(state)
      };
    },

    apply(_tr, pluginState, _oldState, newState) {
      const formattingIsPresent = checkFormattingIsPresent(newState);

      if (formattingIsPresent !== pluginState.formattingIsPresent) {
        dispatch(pluginKey, {
          formattingIsPresent
        });
        return {
          formattingIsPresent
        };
      }

      return pluginState;
    }

  },
  key: pluginKey
});