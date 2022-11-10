import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { drawFakeTextCursor } from './cursor';
export const stateKey = new PluginKey('fakeTextCursorPlugin');
export const createPlugin = () => new SafePlugin({
  key: stateKey,
  props: {
    decorations: drawFakeTextCursor
  }
});

const fakeTextCursorPlugin = () => ({
  name: 'fakeTextCursor',

  pmPlugins() {
    return [{
      name: 'fakeTextCursor',
      plugin: () => createPlugin()
    }];
  }

});

export default fakeTextCursorPlugin;