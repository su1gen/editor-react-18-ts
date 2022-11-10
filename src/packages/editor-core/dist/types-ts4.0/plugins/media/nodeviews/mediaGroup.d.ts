import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ContextIdentifierProvider, MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { MediaClientConfig } from '@atlaskit/media-core';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import React from 'react';
import { EventDispatcher } from '../../../event-dispatcher';
import { getPosHandler } from '../../../nodeviews/';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { MediaOptions } from '../types';
import { WrappedComponentProps } from 'react-intl-next';
export declare type MediaGroupProps = {
    forwardRef?: (ref: HTMLElement) => void;
    node: PMNode;
    view: EditorView;
    getPos: () => number;
    disabled?: boolean;
    allowLazyLoading?: boolean;
    mediaProvider: Promise<MediaProvider>;
    contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
    isCopyPasteEnabled?: boolean;
    anchorPos: number;
    headPos: number;
    mediaOptions: MediaOptions;
} & WrappedComponentProps;
export interface MediaGroupState {
    viewMediaClientConfig?: MediaClientConfig;
}
declare const IntlMediaGroup: React.FC<import("react-intl-next").WithIntlProps<MediaGroupProps>> & {
    WrappedComponent: React.ComponentType<MediaGroupProps>;
};
export default IntlMediaGroup;
export declare const ReactMediaGroupNode: (portalProviderAPI: PortalProviderAPI, eventDispatcher: EventDispatcher, providerFactory: ProviderFactory, mediaOptions?: MediaOptions) => (node: PMNode, view: EditorView, getPos: getPosHandler) => NodeView;
