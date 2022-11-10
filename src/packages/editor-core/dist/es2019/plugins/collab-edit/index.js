import { collab } from 'prosemirror-collab';
import { createPlugin, pluginKey } from './plugin';
import { sendTransaction } from './events/send-transaction';
import { addSynchronyErrorAnalytics } from './analytics';
import { nativeCollabProviderPlugin } from './native-collab-provider-plugin';
export { pluginKey };

const providerBuilder = collabEditProviderPromise => async (codeToExecute, onError) => {
  try {
    const provider = await collabEditProviderPromise;

    if (provider) {
      return codeToExecute(provider);
    }
  } catch (err) {
    if (onError) {
      onError(err);
    } else {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
};

const collabEditPlugin = options => {
  let providerResolver = () => {};

  const collabEditProviderPromise = new Promise(_providerResolver => {
    providerResolver = _providerResolver;
  });
  const executeProviderCode = providerBuilder(collabEditProviderPromise);
  return {
    name: 'collabEdit',

    pmPlugins() {
      const {
        useNativePlugin = false,
        userId = null
      } = options || {};
      return [...(useNativePlugin ? [{
        name: 'pmCollab',
        plugin: () => collab({
          clientID: userId
        })
      }, {
        name: 'nativeCollabProviderPlugin',
        plugin: () => nativeCollabProviderPlugin({
          providerPromise: collabEditProviderPromise
        })
      }] : []), {
        name: 'collab',
        plugin: ({
          dispatch,
          providerFactory
        }) => {
          providerFactory && providerFactory.subscribe('collabEditProvider', (_name, providerPromise) => {
            if (providerPromise) {
              providerPromise.then(provider => providerResolver(provider));
            }
          });
          return createPlugin(dispatch, providerFactory, executeProviderCode, options);
        }
      }];
    },

    onEditorViewStateUpdated(props) {
      const addErrorAnalytics = addSynchronyErrorAnalytics(props.newEditorState, props.newEditorState.tr);
      executeProviderCode(sendTransaction({
        originalTransaction: props.originalTransaction,
        transactions: props.transactions,
        oldEditorState: props.oldEditorState,
        newEditorState: props.newEditorState,
        useNativePlugin: options && options.useNativePlugin
      }), addErrorAnalytics);
    }

  };
};

export default collabEditPlugin;