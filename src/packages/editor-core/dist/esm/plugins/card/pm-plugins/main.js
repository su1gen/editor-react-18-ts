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
export var createPlugin = function createPlugin(options) {
  return function (pmPluginFactoryParams) {
    var platform = options.platform,
        allowResizing = options.allowResizing,
        useAlternativePreloader = options.useAlternativePreloader,
        fullWidthMode = options.fullWidthMode,
        createAnalyticsEvent = options.createAnalyticsEvent;
    return new SafePlugin({
      state: {
        init: function init() {
          var viewChangingExperimentToolbarStyle = pmPluginFactoryParams.featureFlags.viewChangingExperimentToolbarStyle;
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
            createAnalyticsEvent: createAnalyticsEvent
          };
        },
        apply: function apply(tr, pluginState) {
          // Update all the positions of outstanding requests and
          // cards in the plugin state.
          var pluginStateWithUpdatedPos = getPluginStateWithUpdatedPos(pluginState, tr); // apply any actions

          var meta = tr.getMeta(pluginKey);

          if (meta) {
            var nextPluginState = reducer(pluginStateWithUpdatedPos, meta);
            return nextPluginState;
          }

          return pluginStateWithUpdatedPos;
        }
      },
      view: function view(_view) {
        var outstandingRequests = {};

        var subscriptionHandler = function subscriptionHandler(name, provider) {
          return handleProvider(name, provider, _view);
        };

        var rafCancellationCallbacks = [];
        pmPluginFactoryParams.providerFactory.subscribe('cardProvider', subscriptionHandler);
        return {
          update: function update(view, prevState) {
            var currentState = getPluginState(view.state);
            var oldState = getPluginState(prevState);

            if (currentState && currentState.provider) {
              // Find requests in this state that weren't in the old one.
              var newRequests = getNewRequests(oldState, currentState); // Ask the CardProvider to resolve all new requests.

              var provider = currentState.provider;
              newRequests.forEach(function (request) {
                /**
                 * Queue each asynchronous resolve request on separate frames.
                 * ---
                 * NB: The promise for each request is queued to take place on separate animation frames. This avoids
                 * the scenario debugged and discovered in EDM-668, wherein the queuing of too many promises in quick succession
                 * leads to the browser's macrotask queue being overwhelmed, locking interactivity of the browser tab.
                 * By using this approach, the browser is free to schedule the resolution of the promises below in between rendering/network/
                 * other tasks as per common implementations of the JavaScript event loop in browsers.
                 */
                var invoke = rafSchedule(function () {
                  return resolveWithProvider(view, outstandingRequests, provider, request, options);
                });
                rafCancellationCallbacks.push(invoke.cancel);
                invoke();
              });
            }
          },
          destroy: function destroy() {
            // Cancel all outstanding requests
            Object.keys(outstandingRequests).forEach(function (url) {
              return Promise.reject(outstandingRequests[url]);
            }); // Cancel any outstanding raf callbacks.

            rafCancellationCallbacks.forEach(function (cancellationCallback) {
              return cancellationCallback();
            });
            pmPluginFactoryParams.providerFactory.unsubscribe('cardProvider', subscriptionHandler);
          }
        };
      },
      props: {
        nodeViews: {
          inlineCard: getInlineNodeViewProducer({
            pmPluginFactoryParams: pmPluginFactoryParams,
            Component: InlineCardNodeView,
            extraComponentProps: {
              useAlternativePreloader: useAlternativePreloader
            }
          }),
          blockCard: function blockCard(node, view, getPos) {
            var portalProviderAPI = pmPluginFactoryParams.portalProviderAPI,
                eventDispatcher = pmPluginFactoryParams.eventDispatcher;
            var reactComponentProps = {
              platform: platform
            };
            var hasIntlContext = true;
            return new BlockCard(node, view, getPos, portalProviderAPI, eventDispatcher, reactComponentProps, undefined, true, undefined, hasIntlContext).init();
          },
          embedCard: function embedCard(node, view, getPos) {
            var portalProviderAPI = pmPluginFactoryParams.portalProviderAPI,
                eventDispatcher = pmPluginFactoryParams.eventDispatcher,
                dispatchAnalyticsEvent = pmPluginFactoryParams.dispatchAnalyticsEvent;
            var reactComponentProps = {
              eventDispatcher: eventDispatcher,
              allowResizing: allowResizing,
              platform: platform,
              fullWidthMode: fullWidthMode,
              dispatchAnalyticsEvent: dispatchAnalyticsEvent
            };
            var hasIntlContext = true;
            return new EmbedCard(node, view, getPos, portalProviderAPI, eventDispatcher, reactComponentProps, undefined, true, undefined, hasIntlContext).init();
          }
        }
      },
      key: pluginKey
    });
  };
};