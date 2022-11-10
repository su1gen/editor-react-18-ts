import { caption } from '@atlaskit/adf-schema';
import { default as createCaptionPlugin } from './pm-plugins/main';
import { pluginKey } from './pm-plugins/plugin-key';
import { captionKeymap } from './pm-plugins/keymap';
export { pluginKey };

var captionPlugin = function captionPlugin() {
  return {
    name: 'caption',
    nodes: function nodes() {
      return [{
        name: 'caption',
        node: caption
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'caption',
        plugin: function plugin(_ref) {
          var portalProviderAPI = _ref.portalProviderAPI,
              providerFactory = _ref.providerFactory,
              eventDispatcher = _ref.eventDispatcher,
              dispatch = _ref.dispatch;
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