import React, { useEffect, useState } from 'react';
import { SelectionBasedNodeView } from '../../../nodeviews/';
import WithPluginState from '../../../ui/WithPluginState';
import { MediaInlineCard } from '@atlaskit/media-card';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import { MediaInlineNodeSelector } from './styles';
import { stateKey as mediaStateKey } from '../pm-plugins/plugin-key';
import { MediaNodeUpdater } from './mediaNodeUpdater';
import { MediaInlineCardLoadingView } from '@atlaskit/media-ui';
export const createMediaNodeUpdater = props => {
  const node = props.node;
  return new MediaNodeUpdater({ ...props,
    isMediaSingle: true,
    node: node ? node : props.node,
    dispatchAnalyticsEvent: props.dispatchAnalyticsEvent,
    contextIdentifierProvider: props.contextIdentifierProvider
  });
};
/**
 * Handles updating the media inline node attributes
 * but also handling copy-paste for cross-editor of the same instance
 * using the contextid
 *
 */

export const updateMediaNodeAttributes = async props => {
  const mediaNodeUpdater = createMediaNodeUpdater(props);
  const {
    addPendingTask
  } = props.mediaPluginState;
  const node = props.node;

  if (!node) {
    return;
  }

  const contextId = mediaNodeUpdater.getNodeContextId();

  if (!contextId) {
    await mediaNodeUpdater.updateContextId();
  }

  const hasDifferentContextId = await mediaNodeUpdater.hasDifferentContextId();

  if (hasDifferentContextId) {
    try {
      const copyNode = mediaNodeUpdater.copyNode();
      addPendingTask(copyNode);
      await copyNode;
    } catch (e) {
      return;
    }
  }

  await mediaNodeUpdater.updateFileAttrs();
};
export const handleNewNode = props => {
  const {
    node,
    mediaPluginState,
    getPos
  } = props;
  mediaPluginState.handleMediaNodeMount(node, () => getPos());
};
export const MediaInline = props => {
  const [viewMediaClientConfig, setViewMediaClientConfig] = useState();
  useEffect(() => {
    handleNewNode(props);
    updateMediaNodeAttributes(props);
    updateViewMediaClientConfig(props);
    return () => {
      const {
        mediaPluginState
      } = props;
      mediaPluginState.handleMediaNodeUnmount(props.node);
    };
  }, [props]);

  const updateViewMediaClientConfig = async props => {
    const mediaProvider = await props.mediaProvider;

    if (mediaProvider) {
      const viewMediaClientConfig = mediaProvider.viewMediaClientConfig;
      setViewMediaClientConfig(viewMediaClientConfig);
    }
  };

  const {
    id,
    collection
  } = props.node.attrs;
  const identifier = {
    id,
    mediaItemType: 'file',
    collectionName: collection
  };
  /*
   * Only show the loading view if the media provider is not ready
   * prevents calling the media API before the provider is ready
   */

  if (!viewMediaClientConfig) {
    return /*#__PURE__*/React.createElement(MediaInlineCardLoadingView, {
      message: "",
      isSelected: false
    });
  }

  return /*#__PURE__*/React.createElement(MediaInlineCard, {
    isSelected: props.isSelected,
    identifier: identifier,
    mediaClientConfig: viewMediaClientConfig
  });
};
export class MediaInlineNodeView extends SelectionBasedNodeView {
  createDomRef() {
    const domRef = document.createElement('span');
    domRef.contentEditable = 'false';
    return domRef;
  }

  getContentDOM() {
    const dom = document.createElement('span');
    dom.classList.add(MediaInlineNodeSelector);
    return {
      dom
    };
  }

  ignoreMutation() {
    return true;
  }

  viewShouldUpdate(nextNode) {
    if (this.node.attrs !== nextNode.attrs) {
      return true;
    }

    return super.viewShouldUpdate(nextNode);
  }

  render(props) {
    const {
      providerFactory
    } = props;
    const getPos = this.getPos;
    return /*#__PURE__*/React.createElement(WithProviders, {
      providers: ['mediaProvider', 'contextIdentifierProvider'],
      providerFactory: providerFactory,
      renderNode: ({
        mediaProvider,
        contextIdentifierProvider
      }) => {
        if (!mediaProvider) {
          return null;
        }

        return /*#__PURE__*/React.createElement(WithPluginState, {
          editorView: this.view,
          plugins: {
            mediaPluginState: mediaStateKey
          },
          render: ({
            mediaPluginState
          }) => {
            if (!mediaPluginState) {
              return null;
            }

            return /*#__PURE__*/React.createElement(MediaInline, {
              identifier: this.node.attrs.id,
              mediaProvider: mediaProvider,
              mediaPluginState: mediaPluginState,
              node: this.node,
              isSelected: this.nodeInsideSelection(),
              view: this.view,
              getPos: getPos,
              contextIdentifierProvider: contextIdentifierProvider
            });
          }
        });
      }
    });
  }

}
export const ReactMediaInlineNode = (portalProviderAPI, eventDispatcher, providerFactory, dispatchAnalyticsEvent) => (node, view, getPos) => {
  return new MediaInlineNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
    providerFactory,
    dispatchAnalyticsEvent
  }).init();
};