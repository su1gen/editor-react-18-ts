import { extension, bodiedExtension, inlineExtension } from '@atlaskit/adf-schema';
import { createPlugin } from './pm-plugins/main';
import keymapPlugin from './pm-plugins/keymap';
import { createPlugin as createUniqueIdPlugin } from './pm-plugins/unique-id';
import { getToolbarConfig } from './toolbar';
import { getContextPanel } from './context-panel';

var extensionPlugin = function extensionPlugin() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    name: 'extension',
    nodes: function nodes() {
      return [{
        name: 'extension',
        node: extension
      }, {
        name: 'bodiedExtension',
        node: bodiedExtension
      }, {
        name: 'inlineExtension',
        node: inlineExtension
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'extension',
        plugin: function plugin(_ref) {
          var dispatch = _ref.dispatch,
              providerFactory = _ref.providerFactory,
              portalProviderAPI = _ref.portalProviderAPI,
              eventDispatcher = _ref.eventDispatcher;
          var extensionHandlers = options.extensionHandlers || {};
          return createPlugin(dispatch, providerFactory, extensionHandlers, portalProviderAPI, eventDispatcher, options.useLongPressSelection, {
            appearance: options.appearance
          });
        }
      }, {
        name: 'extensionKeymap',
        plugin: keymapPlugin
      }, {
        name: 'extensionUniqueId',
        plugin: function plugin() {
          return createUniqueIdPlugin();
        }
      }];
    },
    pluginsOptions: {
      floatingToolbar: getToolbarConfig(options.breakoutEnabled),
      contextPanel: getContextPanel(options.allowAutoSave)
    }
  };
};

export default extensionPlugin;