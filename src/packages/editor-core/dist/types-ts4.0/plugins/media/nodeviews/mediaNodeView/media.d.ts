import type { ContextIdentifierProvider, MediaProvider } from '@atlaskit/editor-common/provider-factory';
import type { ImageLoaderProps } from '@atlaskit/editor-common/utils';
import { CardDimensions, CardOnClickCallback, NumericalCardDimensions } from '@atlaskit/media-card';
import { MediaClientConfig } from '@atlaskit/media-core';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import React, { Component } from 'react';
import { ProsemirrorGetPosHandler, ReactNodeProps } from '../../../../nodeviews';
import { MediaOptions } from '../../types';
export declare const MEDIA_HEIGHT = 125;
export declare const FILE_WIDTH = 156;
export interface MediaNodeProps extends ReactNodeProps, ImageLoaderProps {
    view: EditorView;
    node: PMNode;
    getPos: ProsemirrorGetPosHandler;
    contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
    originalDimensions: NumericalCardDimensions;
    maxDimensions: CardDimensions;
    isMediaSingle?: boolean;
    onClick?: CardOnClickCallback;
    mediaProvider?: Promise<MediaProvider>;
    isLoading?: boolean;
    mediaOptions?: MediaOptions;
}
interface MediaNodeState {
    viewMediaClientConfig?: MediaClientConfig;
    contextIdentifierProvider?: ContextIdentifierProvider;
}
export declare class MediaNode extends Component<MediaNodeProps, MediaNodeState> {
    private mediaPluginState;
    state: MediaNodeState;
    constructor(props: MediaNodeProps);
    shouldComponentUpdate(nextProps: MediaNodeProps, nextState: MediaNodeState): boolean;
    componentDidMount(): Promise<void>;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: Readonly<MediaNodeProps>): void;
    private setViewMediaClientConfig;
    private selectMediaSingleFromCard;
    private selectMediaSingle;
    render(): JSX.Element;
    private onFullscreenChange;
    private handleNewNode;
}
declare const _default: React.ComponentClass<MediaNodeProps & ImageLoaderProps, any>;
export default _default;
