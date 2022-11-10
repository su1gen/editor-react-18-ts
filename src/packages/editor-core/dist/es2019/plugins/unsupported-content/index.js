import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { confluenceUnsupportedBlock, confluenceUnsupportedInline, unsupportedBlock, unsupportedInline, unsupportedMark, unsupportedNodeAttribute } from '@atlaskit/adf-schema';
import { UnsupportedBlock } from '@atlaskit/editor-common/ui';
import { UnsupportedInlineNodeView } from './unsupported-inline-node-view';
import { ReactNodeView } from '../../nodeviews';
import { getInlineNodeViewProducer } from '../../nodeviews/getInlineNodeViewProducer';
export const pluginKey = new PluginKey('unsupportedContentPlugin');

const createPlugin = pmPluginFactoryParams => {
  const hasIntlContext = true;
  const {
    portalProviderAPI,
    eventDispatcher,
    dispatchAnalyticsEvent
  } = pmPluginFactoryParams;
  return new SafePlugin({
    key: pluginKey,
    props: {
      nodeViews: {
        confluenceUnsupportedBlock: ReactNodeView.fromComponent(UnsupportedBlock, portalProviderAPI, eventDispatcher, {
          dispatchAnalyticsEvent
        }, undefined, hasIntlContext),
        confluenceUnsupportedInline: getInlineNodeViewProducer({
          pmPluginFactoryParams,
          Component: UnsupportedInlineNodeView,
          extraComponentProps: {
            dispatchAnalyticsEvent
          }
        }),
        unsupportedBlock: ReactNodeView.fromComponent(UnsupportedBlock, portalProviderAPI, eventDispatcher, {
          dispatchAnalyticsEvent
        }, undefined, hasIntlContext),
        unsupportedInline: getInlineNodeViewProducer({
          pmPluginFactoryParams,
          Component: UnsupportedInlineNodeView,
          extraComponentProps: {
            dispatchAnalyticsEvent
          }
        })
      }
    }
  });
};

const unsupportedContentPlugin = () => ({
  name: 'unsupportedContent',

  marks() {
    return [{
      name: 'unsupportedMark',
      mark: unsupportedMark
    }, {
      name: 'unsupportedNodeAttribute',
      mark: unsupportedNodeAttribute
    }];
  },

  nodes() {
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

  pmPlugins() {
    return [{
      name: 'unsupportedContent',
      plugin: createPlugin
    }];
  }

});

export default unsupportedContentPlugin;