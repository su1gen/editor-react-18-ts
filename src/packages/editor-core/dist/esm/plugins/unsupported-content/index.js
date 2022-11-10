import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { confluenceUnsupportedBlock, confluenceUnsupportedInline, unsupportedBlock, unsupportedInline, unsupportedMark, unsupportedNodeAttribute } from '@atlaskit/adf-schema';
import { UnsupportedBlock } from '@atlaskit/editor-common/ui';
import { UnsupportedInlineNodeView } from './unsupported-inline-node-view';
import { ReactNodeView } from '../../nodeviews';
import { getInlineNodeViewProducer } from '../../nodeviews/getInlineNodeViewProducer';
export var pluginKey = new PluginKey('unsupportedContentPlugin');

var createPlugin = function createPlugin(pmPluginFactoryParams) {
  var hasIntlContext = true;
  var portalProviderAPI = pmPluginFactoryParams.portalProviderAPI,
      eventDispatcher = pmPluginFactoryParams.eventDispatcher,
      dispatchAnalyticsEvent = pmPluginFactoryParams.dispatchAnalyticsEvent;
  return new SafePlugin({
    key: pluginKey,
    props: {
      nodeViews: {
        confluenceUnsupportedBlock: ReactNodeView.fromComponent(UnsupportedBlock, portalProviderAPI, eventDispatcher, {
          dispatchAnalyticsEvent: dispatchAnalyticsEvent
        }, undefined, hasIntlContext),
        confluenceUnsupportedInline: getInlineNodeViewProducer({
          pmPluginFactoryParams: pmPluginFactoryParams,
          Component: UnsupportedInlineNodeView,
          extraComponentProps: {
            dispatchAnalyticsEvent: dispatchAnalyticsEvent
          }
        }),
        unsupportedBlock: ReactNodeView.fromComponent(UnsupportedBlock, portalProviderAPI, eventDispatcher, {
          dispatchAnalyticsEvent: dispatchAnalyticsEvent
        }, undefined, hasIntlContext),
        unsupportedInline: getInlineNodeViewProducer({
          pmPluginFactoryParams: pmPluginFactoryParams,
          Component: UnsupportedInlineNodeView,
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
        mark: unsupportedMark
      }, {
        name: 'unsupportedNodeAttribute',
        mark: unsupportedNodeAttribute
      }];
    },
    nodes: function nodes() {
      return [{
        name: 'confluenceUnsupportedBlock',
        node: confluenceUnsupportedBlock
      }, {
        name: 'confluenceUnsupportedInline',
        node: confluenceUnsupportedInline
      }, {
        name: 'unsupportedBlock',
        node: unsupportedBlock
      }, {
        name: 'unsupportedInline',
        node: unsupportedInline
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

export default unsupportedContentPlugin;