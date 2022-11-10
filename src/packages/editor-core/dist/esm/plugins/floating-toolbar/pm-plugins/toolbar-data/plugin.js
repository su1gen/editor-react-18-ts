import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { pluginKey } from './plugin-key';
import { createPluginState } from './plugin-factory';
export var createPlugin = function createPlugin(dispatch) {
  return new SafePlugin({
    state: createPluginState(dispatch, {}),
    key: pluginKey
  });
};