"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPlugin = void 0;
Object.defineProperty(exports, "pluginKey", {
  enumerable: true,
  get: function get() {
    return _pluginKey.pluginKey;
  }
});

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _rafSchd = _interopRequireDefault(require("raf-schd"));

var _getInlineNodeViewProducer = require("../../../nodeviews/getInlineNodeViewProducer");

var _reducers = _interopRequireDefault(require("./reducers"));

var _pluginKey = require("./plugin-key");

var _resolve = require("./util/resolve");

var _state = require("./util/state");

var _embedCard = require("../nodeviews/embedCard");

var _blockCard = require("../nodeviews/blockCard");

var _inlineCard = require("../nodeviews/inlineCard");

var _analytics = require("../../../plugins/analytics");

var createPlugin = function createPlugin(options) {
  return function (pmPluginFactoryParams) {
    var platform = options.platform,
        allowResizing = options.allowResizing,
        useAlternativePreloader = options.useAlternativePreloader,
        fullWidthMode = options.fullWidthMode,
        createAnalyticsEvent = options.createAnalyticsEvent;
    return new _safePlugin.SafePlugin({
      state: {
        init: function init() {
          var viewChangingExperimentToolbarStyle = pmPluginFactoryParams.featureFlags.viewChangingExperimentToolbarStyle;
          pmPluginFactoryParams.dispatchAnalyticsEvent({
            eventType: _analytics.EVENT_TYPE.OPERATIONAL,
            action: _analytics.ACTION.EXPOSED,
            actionSubject: _analytics.ACTION_SUBJECT.FEATURE,
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
          var pluginStateWithUpdatedPos = (0, _state.getPluginStateWithUpdatedPos)(pluginState, tr); // apply any actions

          var meta = tr.getMeta(_pluginKey.pluginKey);

          if (meta) {
            var nextPluginState = (0, _reducers.default)(pluginStateWithUpdatedPos, meta);
            return nextPluginState;
          }

          return pluginStateWithUpdatedPos;
        }
      },
      view: function view(_view) {
        var outstandingRequests = {};

        var subscriptionHandler = function subscriptionHandler(name, provider) {
          return (0, _resolve.handleProvider)(name, provider, _view);
        };

        var rafCancellationCallbacks = [];
        pmPluginFactoryParams.providerFactory.subscribe('cardProvider', subscriptionHandler);
        return {
          update: function update(view, prevState) {
            var currentState = (0, _state.getPluginState)(view.state);
            var oldState = (0, _state.getPluginState)(prevState);

            if (currentState && currentState.provider) {
              // Find requests in this state that weren't in the old one.
              var newRequests = (0, _state.getNewRequests)(oldState, currentState); // Ask the CardProvider to resolve all new requests.

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
                var invoke = (0, _rafSchd.default)(function () {
                  return (0, _resolve.resolveWithProvider)(view, outstandingRequests, provider, request, options);
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
          inlineCard: (0, _getInlineNodeViewProducer.getInlineNodeViewProducer)({
            pmPluginFactoryParams: pmPluginFactoryParams,
            Component: _inlineCard.InlineCardNodeView,
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
            return new _blockCard.BlockCard(node, view, getPos, portalProviderAPI, eventDispatcher, reactComponentProps, undefined, true, undefined, hasIntlContext).init();
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
            return new _embedCard.EmbedCard(node, view, getPos, portalProviderAPI, eventDispatcher, reactComponentProps, undefined, true, undefined, hasIntlContext).init();
          }
        }
      },
      key: _pluginKey.pluginKey
    });
  };
};

exports.createPlugin = createPlugin;