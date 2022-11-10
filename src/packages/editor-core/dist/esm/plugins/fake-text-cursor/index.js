import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { drawFakeTextCursor } from './cursor';
export var stateKey = new PluginKey('fakeTextCursorPlugin');
export var createPlugin = function createPlugin() {
  return new SafePlugin({
    key: stateKey,
    props: {
      decorations: drawFakeTextCursor
    }
  });
};

var fakeTextCursorPlugin = function fakeTextCursorPlugin() {
  return {
    name: 'fakeTextCursor',
    pmPlugins: function pmPlugins() {
      return [{
        name: 'fakeTextCursor',
        plugin: function plugin() {
          return createPlugin();
        }
      }];
    }
  };
};

export default fakeTextCursorPlugin;