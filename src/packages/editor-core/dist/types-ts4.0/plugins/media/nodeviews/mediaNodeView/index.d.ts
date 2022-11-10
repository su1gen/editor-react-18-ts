/// <reference types="react" />
import { MediaADFAttrs } from '@atlaskit/adf-schema';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { Providers, MediaProvider, ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { EventDispatcher } from '../../../../event-dispatcher';
import { getPosHandler, SelectionBasedNodeView } from '../../../../nodeviews';
import { PortalProviderAPI } from '../../../../ui/PortalProvider';
import { WidthPluginState } from '../../../width';
import { MediaOptions } from '../../types';
import { MediaNodeViewProps } from '../types';
declare class MediaNodeView extends SelectionBasedNodeView<MediaNodeViewProps> {
    createDomRef(): HTMLElement;
    viewShouldUpdate(nextNode: PMNode): boolean;
    stopEvent(event: Event): boolean;
    getAttrs(): MediaADFAttrs;
    isMediaBlobUrl(): boolean;
    renderMediaNodeWithState: (mediaProvider?: Promise<MediaProvider> | undefined, contextIdentifierProvider?: Promise<ContextIdentifierProvider> | undefined) => ({ width: editorWidth }: {
        width?: import("@atlaskit/editor-common/types").EditorContainerWidth | undefined;
    }) => JSX.Element;
    renderMediaNodeWithProviders: ({ mediaProvider, contextIdentifierProvider, }: Providers) => JSX.Element;
    render(): JSX.Element;
}
export declare const ReactMediaNode: (portalProviderAPI: PortalProviderAPI, eventDispatcher: EventDispatcher, providerFactory: ProviderFactory, mediaOptions?: MediaOptions) => (node: PMNode, view: EditorView, getPos: getPosHandler) => MediaNodeView;
export {};
