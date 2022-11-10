import React from 'react';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import memoizeOne from 'memoize-one';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import { pluginKey } from './plugin-key';
import { searchQuickInsertItems } from './search';
import ModalElementBrowser from './ui/ModalElementBrowser';
export { pluginKey };

const quickInsertPlugin = options => ({
  name: 'quickInsert',

  pmPlugins(quickInsert) {
    return [{
      name: 'quickInsert',
      // It's important that this plugin is above TypeAheadPlugin
      plugin: ({
        providerFactory,
        getIntl,
        dispatch
      }) => quickInsertPluginFactory(quickInsert, providerFactory, getIntl, dispatch, options === null || options === void 0 ? void 0 : options.emptyStateHandler)
    }];
  },

  pluginsOptions: {
    typeAhead: {
      id: TypeAheadAvailableNodes.QUICK_INSERT,
      trigger: '/',
      headless: options ? options.headless : undefined,

      getItems({
        query,
        editorState
      }) {
        const quickInsertState = pluginKey.getState(editorState);
        return Promise.resolve(searchQuickInsertItems(quickInsertState, options)(query));
      },

      selectItem: (state, item, insert) => {
        return item.action(insert, state);
      }
    }
  },

  contentComponent({
    editorView
  }) {
    if (options && options.enableElementBrowser) {
      return /*#__PURE__*/React.createElement(ModalElementBrowser, {
        editorView: editorView,
        helpUrl: options.elementBrowserHelpUrl
      });
    }

    return null;
  }

});

export default quickInsertPlugin;

const processItems = (items, intl, extendedActions) => {
  const reducedItems = items.reduce((acc, item) => {
    if (typeof item === 'function') {
      const quickInsertItems = item(intl);
      return acc.concat(quickInsertItems);
    }

    return acc.concat(item);
  }, []);
  return extendQuickInsertAction(reducedItems, extendedActions);
};

export const memoProcessItems = memoizeOne(processItems);
/**
 * Allows for extending the quickInsertItems actions with the provided extendedActions.
 * The provided extended action will then be called after the original action is executed.
 * This is useful for mobile communications where we need to talk to the mobile bridge.
 */

const extendQuickInsertAction = (quickInsertItems, extendedActions) => {
  if (!extendedActions) {
    return quickInsertItems;
  }

  return quickInsertItems.map(quickInsertItem => {
    const quickInsertId = quickInsertItem.id;

    if (quickInsertId && extendedActions[quickInsertId]) {
      const originalAction = quickInsertItem.action;

      quickInsertItem.action = (insert, state) => {
        const result = originalAction(insert, state);
        extendedActions[quickInsertId](quickInsertItem);
        return result;
      };
    }

    return quickInsertItem;
  });
};

const setProviderState = providerState => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setMeta(pluginKey, providerState));
  }

  return true;
};

function quickInsertPluginFactory(quickInsertItems, providerFactory, getIntl, dispatch, emptyStateHandler) {
  return new SafePlugin({
    key: pluginKey,
    state: {
      init() {
        return {
          isElementBrowserModalOpen: false,
          emptyStateHandler,
          // lazy so it doesn't run on editor initialization
          // memo here to avoid using a singleton cache, avoids editor
          // getting confused when two editors exist within the same page.
          lazyDefaultItems: () => memoProcessItems(quickInsertItems || [], getIntl())
        };
      },

      apply(tr, pluginState) {
        const meta = tr.getMeta(pluginKey);

        if (meta) {
          const keys = Object.keys(meta);
          const changed = keys.some(key => {
            return pluginState[key] !== meta[key];
          });

          if (changed) {
            const newState = { ...pluginState,
              ...meta
            };
            dispatch(pluginKey, newState);
            return newState;
          }
        }

        return pluginState;
      }

    },

    view(editorView) {
      const providerHandler = async (_name, providerPromise) => {
        if (providerPromise) {
          try {
            const provider = await providerPromise;
            const providedItems = await provider.getItems();
            setProviderState({
              provider,
              providedItems
            })(editorView.state, editorView.dispatch);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('Error getting items from quick insert provider', e);
          }
        }
      };

      providerFactory.subscribe('quickInsertProvider', providerHandler);
      return {
        destroy() {
          providerFactory.unsubscribe('quickInsertProvider', providerHandler);
        }

      };
    }

  });
}