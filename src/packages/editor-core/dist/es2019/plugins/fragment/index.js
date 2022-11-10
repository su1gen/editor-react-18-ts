import { fragment } from '@atlaskit/adf-schema';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { pluginKey } from './plugin-key';
import { createPlugin as createFragmentMarkConsistencyPlugin } from './pm-plugins/fragment-consistency';
export function createPlugin() {
  return new SafePlugin({
    key: pluginKey
  });
}

const fragmentMarkPlugin = () => ({
  name: 'fragmentPlugin',

  marks() {
    return [{
      name: 'fragment',
      mark: fragment
    }];
  },

  pmPlugins() {
    return [{
      name: 'fragmentMarkConsistency',
      plugin: ({
        dispatch
      }) => createFragmentMarkConsistencyPlugin(dispatch)
    }];
  }

});

export default fragmentMarkPlugin;