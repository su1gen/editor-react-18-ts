import { fragment } from '@atlaskit/adf-schema';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { pluginKey } from './plugin-key';
import { createPlugin as createFragmentMarkConsistencyPlugin } from './pm-plugins/fragment-consistency';
export function createPlugin() {
  return new SafePlugin({
    key: pluginKey
  });
}

var fragmentMarkPlugin = function fragmentMarkPlugin() {
  return {
    name: 'fragmentPlugin',
    marks: function marks() {
      return [{
        name: 'fragment',
        mark: fragment
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'fragmentMarkConsistency',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createFragmentMarkConsistencyPlugin(dispatch);
        }
      }];
    }
  };
};

export default fragmentMarkPlugin;