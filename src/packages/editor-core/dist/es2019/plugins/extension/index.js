import { extension, bodiedExtension, inlineExtension } from '@atlaskit/adf-schema';
import { createPlugin } from './pm-plugins/main';
import keymapPlugin from './pm-plugins/keymap';
import { createPlugin as createUniqueIdPlugin } from './pm-plugins/unique-id';
import { getToolbarConfig } from './toolbar';
import { getContextPanel } from './context-panel';

const extensionPlugin = (options = {}) => ({
  name: 'extension',

  nodes() {
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

  pmPlugins() {
    return [{
      name: 'extension',
      plugin: ({
        dispatch,
        providerFactory,
        portalProviderAPI,
        eventDispatcher
      }) => {
        const extensionHandlers = options.extensionHandlers || {};
        return createPlugin(dispatch, providerFactory, extensionHandlers, portalProviderAPI, eventDispatcher, options.useLongPressSelection, {
          appearance: options.appearance
        });
      }
    }, {
      name: 'extensionKeymap',
      plugin: keymapPlugin
    }, {
      name: 'extensionUniqueId',
      plugin: () => createUniqueIdPlugin()
    }];
  },

  pluginsOptions: {
    floatingToolbar: getToolbarConfig(options.breakoutEnabled),
    contextPanel: getContextPanel(options.allowAutoSave)
  }
});

export default extensionPlugin;