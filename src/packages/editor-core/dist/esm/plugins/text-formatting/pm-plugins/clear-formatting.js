import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { checkFormattingIsPresent } from '../utils';
export var pluginKey = new PluginKey('clearFormattingPlugin');
export var plugin = function plugin(dispatch) {
  return new SafePlugin({
    state: {
      init: function init(_config, state) {
        return {
          formattingIsPresent: checkFormattingIsPresent(state)
        };
      },
      apply: function apply(_tr, pluginState, _oldState, newState) {
        var formattingIsPresent = checkFormattingIsPresent(newState);

        if (formattingIsPresent !== pluginState.formattingIsPresent) {
          dispatch(pluginKey, {
            formattingIsPresent: formattingIsPresent
          });
          return {
            formattingIsPresent: formattingIsPresent
          };
        }

        return pluginState;
      }
    },
    key: pluginKey
  });
};