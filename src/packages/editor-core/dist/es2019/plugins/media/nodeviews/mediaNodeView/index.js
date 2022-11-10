import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import { DEFAULT_IMAGE_HEIGHT, DEFAULT_IMAGE_WIDTH } from '@atlaskit/editor-common/ui';
import { browser } from '@atlaskit/editor-common/utils';
import { NodeSelection } from 'prosemirror-state';
import React from 'react';
import { SelectionBasedNodeView } from '../../../../nodeviews';
import WithPluginState from '../../../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../../../width';
import MediaNode from './media';
import { getAttrsFromUrl } from '@atlaskit/media-client';
import { isMediaBlobUrlFromAttrs } from '../../utils/media-common';

class MediaNodeView extends SelectionBasedNodeView {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "renderMediaNodeWithState", (mediaProvider, contextIdentifierProvider) => {
      return ({
        width: editorWidth
      }) => {
        const getPos = this.getPos;
        const {
          mediaOptions
        } = this.reactComponentProps;
        const {
          selection
        } = this.view.state;

        const isSelected = () => this.isNodeInsideSelection(selection.from, selection.to) || selection instanceof NodeSelection && selection.from === getPos();

        const attrs = this.getAttrs();
        const url = attrs.type === 'external' ? attrs.url : '';
        let {
          width,
          height
        } = attrs;

        if (this.isMediaBlobUrl()) {
          const urlAttrs = getAttrsFromUrl(url);

          if (urlAttrs) {
            const {
              width: urlWidth,
              height: urlHeight
            } = urlAttrs;
            width = width || urlWidth;
            height = height || urlHeight;
          }
        }

        width = width || DEFAULT_IMAGE_WIDTH;
        height = height || DEFAULT_IMAGE_HEIGHT;
        const maxDimensions = {
          width: `${editorWidth.width}px`,
          height: `${height / width * editorWidth.width}px`
        };
        const originalDimensions = {
          width,
          height
        };
        return /*#__PURE__*/React.createElement(MediaNode, {
          view: this.view,
          node: this.node,
          getPos: getPos,
          selected: isSelected(),
          originalDimensions: originalDimensions,
          maxDimensions: maxDimensions,
          url: url,
          mediaProvider: mediaProvider,
          contextIdentifierProvider: contextIdentifierProvider,
          mediaOptions: mediaOptions
        });
      };
    });

    _defineProperty(this, "renderMediaNodeWithProviders", ({
      mediaProvider,
      contextIdentifierProvider
    }) => {
      return /*#__PURE__*/React.createElement(WithPluginState, {
        editorView: this.view,
        plugins: {
          width: widthPluginKey
        },
        render: this.renderMediaNodeWithState(mediaProvider, contextIdentifierProvider)
      });
    });
  }

  createDomRef() {
    const domRef = document.createElement('div');

    if (browser.chrome && this.reactComponentProps.mediaOptions && this.reactComponentProps.mediaOptions.allowMediaSingleEditable) {
      // workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
      // see also: https://github.com/ProseMirror/prosemirror/issues/884
      domRef.contentEditable = 'true';
    }

    return domRef;
  }

  viewShouldUpdate(nextNode) {
    if (this.node.attrs !== nextNode.attrs) {
      return true;
    }

    return super.viewShouldUpdate(nextNode);
  }

  stopEvent(event) {
    // Don't trap right click events on media node
    if (['mousedown', 'contextmenu'].indexOf(event.type) !== -1) {
      const mouseEvent = event;

      if (mouseEvent.button === 2) {
        return true;
      }
    }

    return false;
  }

  getAttrs() {
    const {
      attrs
    } = this.node;
    return attrs;
  }

  isMediaBlobUrl() {
    const attrs = this.getAttrs();
    return isMediaBlobUrlFromAttrs(attrs);
  }

  render() {
    const {
      providerFactory
    } = this.reactComponentProps;
    return /*#__PURE__*/React.createElement(WithProviders, {
      providers: ['mediaProvider', 'contextIdentifierProvider'],
      providerFactory: providerFactory,
      renderNode: this.renderMediaNodeWithProviders
    });
  }

}

export const ReactMediaNode = (portalProviderAPI, eventDispatcher, providerFactory, mediaOptions = {}) => (node, view, getPos) => {
  const hasIntlContext = true;
  return new MediaNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
    eventDispatcher,
    providerFactory,
    mediaOptions
  }, undefined, undefined, undefined, hasIntlContext).init();
};