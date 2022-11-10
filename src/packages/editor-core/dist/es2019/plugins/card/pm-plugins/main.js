import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import rafSchedule from 'raf-schd';
import { getInlineNodeViewProducer } from '../../../nodeviews/getInlineNodeViewProducer';
import reducer from './reducers';
import { pluginKey } from './plugin-key';
import { handleProvider, resolveWithProvider } from './util/resolve';
import { getNewRequests, getPluginState, getPluginStateWithUpdatedPos } from './util/state';
import { EmbedCard } from '../nodeviews/embedCard';
import { BlockCard } from '../nodeviews/blockCard';
import { InlineCardNodeView } from '../nodeviews/inlineCard';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../../plugins/analytics';
export { pluginKey } from './plugin-key';
export const createPlugin = options => pmPluginFactoryParams => {
  const {
    platform,
    allowResizing,
    useAlternativePreloader,
    fullWidthMode,
    createAnalyticsEvent
  } = options;
  return new SafePlugin({
    state: {
      init() {
        const {
          viewChangingExperimentToolbarStyle
        } = pmPluginFactoryParams.featureFlags;
        pmPluginFactoryParams.dispatchAnalyticsEvent({
          eventType: EVENT_TYPE.OPERATIONAL,
          action: ACTION.EXPOSED,
          actionSubject: ACTION_SUBJECT.FEATURE,
          attributes: {
            flagKey: 'confluence.frontend.fabric.editor.view-changing-experiment-toolbar-style',
            value: viewChangingExperimentToolbarStyle || 'noChange'
          },
          source: '@atlaskit/feature-flag-client',
          tags: ['measurement']
        });
        return {
          requests: [],
          provider: null,
          cards: [],
          showLinkingToolbar: false,
          smartLinkEvents: undefined,
          createAnalyticsEvent
        };
      },

      apply(tr, pluginState) {
        // Update all the positions of outstanding requests and
        // cards in the plugin state.
        const pluginStateWithUpdatedPos = getPluginStateWithUpdatedPos(pluginState, tr); // apply any actions

        const meta = tr.getMeta(pluginKey);

        if (meta) {
          const nextPluginState = reducer(pluginStateWithUpdatedPos, meta);
          return nextPluginState;
        }

        return pluginStateWithUpdatedPos;
      }

    },

    view(view) {
      const outstandingRequests = {};

      const subscriptionHandler = (name, provider) => handleProvider(name, provider, view);

      const rafCancellationCallbacks = [];
      pmPluginFactoryParams.providerFactory.subscribe('cardProvider', subscriptionHandler);
      return {
        update(view, prevState) {
          const currentState = getPluginState(view.state);
          const oldState = getPluginState(prevState);

          if (currentState && currentState.provider) {
            // Find requests in this state that weren't in the old one.
            const newRequests = getNewRequests(oldState, currentState); // Ask the CardProvider to resolve all new requests.

            const {
              provider
            } = currentState;
            newRequests.forEach(request => {
              /**
               * Queue each asynchronous resolve request on separate frames.
               * ---
               * NB: The promise for each request is queued to take place on separate animation frames. This avoids
               * the scenario debugged and discovered in EDM-668, wherein the queuing of too many promises in quick succession
               * leads to the browser's macrotask queue being overwhelmed, locking interactivity of the browser tab.
               * By using this approach, the browser is free to schedule the resolution of the promises below in between rendering/network/
               * other tasks as per common implementations of the JavaScript event loop in browsers.
               */
              const invoke = rafSchedule(() => resolveWithProvider(view, outstandingRequests, provider, request, options));
              rafCancellationCallbacks.push(invoke.cancel);
              invoke();
            });
          }
        },

        destroy() {
          // Cancel all outstanding requests
          Object.keys(outstandingRequests).forEach(url => Promise.reject(outstandingRequests[url])); // Cancel any outstanding raf callbacks.

          rafCancellationCallbacks.forEach(cancellationCallback => cancellationCallback());
          pmPluginFactoryParams.providerFactory.unsubscribe('cardProvider', subscriptionHandler);
        }

      };
    },

    props: {
      nodeViews: {
        inlineCard: getInlineNodeViewProducer({
          pmPluginFactoryParams,
          Component: InlineCardNodeView,
          extraComponentProps: {
            useAlternativePreloader
          }
        }),
        blockCard: (node, view, getPos) => {
          const {
            portalProviderAPI,
            eventDispatcher
          } = pmPluginFactoryParams;
          const reactComponentProps = {
            platform
          };
          const hasIntlContext = true;
          return new BlockCard(node, view, getPos, portalProviderAPI, eventDispatcher, reactComponentProps, undefined, true, undefined, hasIntlContext).init();
        },
        embedCard: (node, view, getPos) => {
          const {
            portalProviderAPI,
            eventDispatcher,
            dispatchAnalyticsEvent
          } = pmPluginFactoryParams;
          const reactComponentProps = {
            eventDispatcher,
            allowResizing,
            platform,
            fullWidthMode,
            dispatchAnalyticsEvent
          };
          const hasIntlContext = true;
          return new EmbedCard(node, view, getPos, portalProviderAPI, eventDispatcher, reactComponentProps, undefined, true, undefined, hasIntlContext).init();
        }
      }
    },
    key: pluginKey
  });
};