import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
export var pluginKey = new PluginKey('maxContentSizePlugin');
export function createPlugin(dispatch, maxContentSize) {
  if (!maxContentSize) {
    return;
  }

  var maxContentSizeReached = false;
  return new SafePlugin({
    filterTransaction: function filterTransaction(tr) {
      var result = tr.doc && tr.doc.nodeSize > maxContentSize;

      if (result || result !== maxContentSizeReached) {
        dispatch(pluginKey, {
          maxContentSizeReached: result
        });
      }

      maxContentSizeReached = result;
      return !result;
    }
  });
}

var maxContentSizePlugin = function maxContentSizePlugin(maxContentSize) {
  return {
    name: 'maxContentSize',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'maxContentSize',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch;
          return createPlugin(dispatch, maxContentSize);
        }
      }];
    }
  };
};

export default maxContentSizePlugin;