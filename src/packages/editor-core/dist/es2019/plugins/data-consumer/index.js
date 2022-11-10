import { dataConsumer } from '@atlaskit/adf-schema';
import { Plugin } from 'prosemirror-state';
import { pluginKey } from './plugin-key';
export function createPlugin() {
  return new Plugin({
    key: pluginKey
  });
}

const dataConsumerMarkPlugin = () => ({
  name: 'dataConsumerPlugin',

  marks() {
    return [{
      name: 'dataConsumer',
      mark: dataConsumer
    }];
  }

});

export default dataConsumerMarkPlugin;