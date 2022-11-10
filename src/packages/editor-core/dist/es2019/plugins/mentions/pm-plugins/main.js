import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { SLI_EVENT_TYPE, SMART_EVENT_TYPE, buildSliPayload } from '@atlaskit/mention/resource';
import { getInlineNodeViewProducer } from '../../../nodeviews/getInlineNodeViewProducer';
import { MentionNodeView } from '../nodeviews/mention';
import { mentionPluginKey } from './key';
const ACTIONS = {
  SET_PROVIDER: 'SET_PROVIDER',
  SET_CONTEXT: 'SET_CONTEXT'
};

const setProvider = provider => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setMeta(mentionPluginKey, {
      action: ACTIONS.SET_PROVIDER,
      params: {
        provider
      }
    }));
  }

  return true;
};

export const setContext = context => (state, dispatch) => {
  if (dispatch) {
    dispatch(state.tr.setMeta(mentionPluginKey, {
      action: ACTIONS.SET_CONTEXT,
      params: {
        context
      }
    }));
  }

  return true;
};
export function createMentionPlugin(pmPluginFactoryParams, fireEvent, options) {
  let mentionProvider;

  const sendAnalytics = (event, actionSubject, action, attributes) => {
    if (event === SLI_EVENT_TYPE || event === SMART_EVENT_TYPE) {
      fireEvent(buildSliPayload(actionSubject, action, attributes));
    }
  };

  return new SafePlugin({
    key: mentionPluginKey,
    state: {
      init() {
        return {};
      },

      apply(tr, pluginState) {
        const {
          action,
          params
        } = tr.getMeta(mentionPluginKey) || {
          action: null,
          params: null
        };
        let newPluginState = pluginState;

        switch (action) {
          case ACTIONS.SET_PROVIDER:
            newPluginState = { ...pluginState,
              mentionProvider: params.provider
            };
            pmPluginFactoryParams.dispatch(mentionPluginKey, newPluginState);
            return newPluginState;

          case ACTIONS.SET_CONTEXT:
            newPluginState = { ...pluginState,
              contextIdentifierProvider: params.context
            };
            pmPluginFactoryParams.dispatch(mentionPluginKey, newPluginState);
            return newPluginState;
        }

        return newPluginState;
      }

    },
    props: {
      nodeViews: {
        mention: getInlineNodeViewProducer({
          pmPluginFactoryParams,
          Component: MentionNodeView,
          extraComponentProps: {
            providerFactory: pmPluginFactoryParams.providerFactory,
            options
          }
        })
      }
    },

    view(editorView) {
      const providerHandler = (name, providerPromise) => {
        switch (name) {
          case 'mentionProvider':
            if (!providerPromise) {
              return setProvider(undefined)(editorView.state, editorView.dispatch);
            }

            providerPromise.then(provider => {
              if (mentionProvider) {
                mentionProvider.unsubscribe('mentionPlugin');
              }

              mentionProvider = provider;
              setProvider(provider)(editorView.state, editorView.dispatch);
              provider.subscribe('mentionPlugin', undefined, undefined, undefined, undefined, sendAnalytics);
            }).catch(() => setProvider(undefined)(editorView.state, editorView.dispatch));
            break;

          case 'contextIdentifierProvider':
            if (!providerPromise) {
              return setContext(undefined)(editorView.state, editorView.dispatch);
            }

            providerPromise.then(provider => {
              setContext(provider)(editorView.state, editorView.dispatch);
            });
            break;
        }

        return;
      };

      pmPluginFactoryParams.providerFactory.subscribe('mentionProvider', providerHandler);
      pmPluginFactoryParams.providerFactory.subscribe('contextIdentifierProvider', providerHandler);
      return {
        destroy() {
          if (pmPluginFactoryParams.providerFactory) {
            pmPluginFactoryParams.providerFactory.unsubscribe('mentionProvider', providerHandler);
            pmPluginFactoryParams.providerFactory.unsubscribe('contextIdentifierProvider', providerHandler);
          }

          if (mentionProvider) {
            mentionProvider.unsubscribe('mentionPlugin');
          }
        }

      };
    }

  });
}