"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pluginKey = exports.default = void 0;

var _safePlugin = require("@atlaskit/editor-common/safe-plugin");

var _prosemirrorState = require("prosemirror-state");

var _adfSchema = require("@atlaskit/adf-schema");

var _ui = require("@atlaskit/editor-common/ui");

var _unsupportedInlineNodeView = require("./unsupported-inline-node-view");

var _nodeviews = require("../../nodeviews");

var _getInlineNodeViewProducer = require("../../nodeviews/getInlineNodeViewProducer");

var pluginKey = new _prosemirrorState.PluginKey('unsupportedContentPlugin');
exports.pluginKey = pluginKey;

var createPlugin = function createPlugin(pmPluginFactoryParams) {
  var hasIntlContext = true;
  var portalProviderAPI = pmPluginFactoryParams.portalProviderAPI,
      eventDispatcher = pmPluginFactoryParams.eventDispatcher,
      dispatchAnalyticsEvent = pmPluginFactoryParams.dispatchAnalyticsEvent;
  return new _safePlugin.SafePlugin({
    key: pluginKey,
    props: {
      nodeViews: {
        confluenceUnsupportedBlock: _nodeviews.ReactNodeView.fromComponent(_ui.UnsupportedBlock, portalProviderAPI, eventDispatcher, {
          dispatchAnalyticsEvent: dispatchAnalyticsEvent
        }, undefined, hasIntlContext),
        confluenceUnsupportedInline: (0, _getInlineNodeViewProducer.getInlineNodeViewProducer)({
          pmPluginFactoryParams: pmPluginFactoryParams,
          Component: _unsupportedInlineNodeView.UnsupportedInlineNodeView,
          extraComponentProps: {
            dispatchAnalyticsEvent: dispatchAnalyticsEvent
          }
        }),
        unsupportedBlock: _nodeviews.ReactNodeView.fromComponent(_ui.UnsupportedBlock, portalProviderAPI, eventDispatcher, {
          dispatchAnalyticsEvent: dispatchAnalyticsEvent
        }, undefined, hasIntlContext),
        unsupportedInline: (0, _getInlineNodeViewProducer.getInlineNodeViewProducer)({
          pmPluginFactoryParams: pmPluginFactoryParams,
          Component: _unsupportedInlineNodeView.UnsupportedInlineNodeView,
          extraComponentProps: {
            dispatchAnalyticsEvent: dispatchAnalyticsEvent
          }
        })
      }
    }
  });
};

var unsupportedContentPlugin = function unsupportedContentPlugin() {
  return {
    name: 'unsupportedContent',
    marks: function marks() {
      return [{
        name: 'unsupportedMark',
        mark: _adfSchema.unsupportedMark
      }, {
        name: 'unsupportedNodeAttribute',
        mark: _adfSchema.unsupportedNodeAttribute
      }];
    },
    nodes: function nodes() {
      return [{
        name: 'confluenceUnsupportedBlock',
        node: _adfSchema.confluenceUnsupportedBlock
      }, {
        name: 'confluenceUnsupportedInline',
        node: _adfSchema.confluenceUnsupportedInline
      }, {
        name: 'unsupportedBlock',
        node: _adfSchema.unsupportedBlock
      }, {
        name: 'unsupportedInline',
        node: _adfSchema.unsupportedInline
      }];
    },
    pmPlugins: function pmPlugins() {
      return [{
        name: 'unsupportedContent',
        plugin: createPlugin
      }];
    }
  };
};

var _default = unsupportedContentPlugin;
exports.default = _default;