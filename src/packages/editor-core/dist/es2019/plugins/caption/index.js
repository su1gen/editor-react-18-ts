import { caption } from '@atlaskit/adf-schema';
import { default as createCaptionPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import { captionKeymap } from './pm-plugins/keymap';
export { pluginKey };

const captionPlugin = () => {
  return {
    name: 'caption',

    nodes() {
      return [{
        name: 'caption',
        node: caption
      }];
    },

    pmPlugins() {
      return [{
        name: 'caption',
        plugin: ({
          portalProviderAPI,
          providerFactory,
          eventDispatcher,
          dispatch
        }) => {
          return createCaptionPlugin(portalProviderAPI, eventDispatcher, providerFactory, dispatch);
        }
      }, {
        name: 'captionKeymap',
        plugin: captionKeymap
      }];
    }

  };
};

export default captionPlugin;