import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import React from 'react';
import { EventDispatcher } from '../../../event-dispatcher';
import { getPosHandler, ProsemirrorGetPosHandler, SelectionBasedNodeView } from '../../../nodeviews/';
import { FileIdentifier } from '@atlaskit/media-client';
import { ProviderFactory, ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { PortalProviderAPI } from '../../../../src/ui/PortalProvider';
import { MediaPluginState } from '../pm-plugins/types';
import { MediaNodeUpdater } from './mediaNodeUpdater';
import { DispatchAnalyticsEvent } from '../../analytics';
export interface MediaInlineProps {
    mediaProvider: Promise<MediaProvider>;
    identifier: FileIdentifier;
    node: PMNode;
    isSelected: boolean;
    view: EditorView;
    getPos: ProsemirrorGetPosHandler;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
    contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
    mediaPluginState: MediaPluginState;
}
export declare const createMediaNodeUpdater: (props: MediaInlineProps) => MediaNodeUpdater;
/**
 * Handles updating the media inline node attributes
 * but also handling copy-paste for cross-editor of the same instance
 * using the contextid
 *
 */
export declare const updateMediaNodeAttributes: (props: MediaInlineProps) => Promise<void>;
export declare const handleNewNode: (props: MediaInlineProps) => void;
export declare const MediaInline: React.FC<MediaInlineProps>;
export interface MediaInlineNodeViewProps {
    providerFactory: ProviderFactory;
    dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
}
export declare class MediaInlineNodeView extends SelectionBasedNodeView<MediaInlineNodeViewProps> {
    createDomRef(): HTMLSpanElement;
    getContentDOM(): {
        dom: HTMLSpanElement;
    };
    ignoreMutation(): boolean;
    viewShouldUpdate(nextNode: PMNode): boolean;
    render(props: MediaInlineNodeViewProps): JSX.Element;
}
export declare const ReactMediaInlineNode: (portalProviderAPI: PortalProviderAPI, eventDispatcher: EventDispatcher, providerFactory: ProviderFactory, dispatchAnalyticsEvent?: DispatchAnalyticsEvent | undefined) => (node: PMNode, view: EditorView, getPos: getPosHandler) => NodeView;
