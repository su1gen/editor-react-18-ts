import React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import PropTypes from 'prop-types';
import { SmartCardProps } from './genericCard';
import { RichMediaLayout } from '@atlaskit/adf-schema';
import { SelectionBasedNodeView } from '../../../nodeviews/';
export declare type EmbedCardState = {
    hasPreview: boolean;
    liveHeight?: number;
    initialAspectRatio?: number;
};
export declare class EmbedCardComponent extends React.PureComponent<SmartCardProps, EmbedCardState> {
    private scrollContainer?;
    private embedIframeRef;
    onClick: () => void;
    static contextTypes: {
        contextAdapter: PropTypes.Requireable<object>;
    };
    state: EmbedCardState;
    UNSAFE_componentWillMount(): void;
    private getPosSafely;
    onResolve: (data: {
        url?: string | undefined;
        title?: string | undefined;
        aspectRatio?: number | undefined;
    }) => void;
    updateSize: (pctWidth: number | null, layout: RichMediaLayout) => true | undefined;
    private getLineLength;
    /**
     * Even though render is capable of listening and reacting to iframely wrapper iframe sent `resize` events
     * it's good idea to store latest actual height in ADF, so that when renderer (well, editor as well) is loading
     * we will show embed window of appropriate size and avoid unnecessary content jumping.
     */
    saveOriginalDimensionsAttributes: (height: number, width: number | undefined) => void;
    onHeightUpdate: (height: number) => void;
    render(): JSX.Element;
}
export declare type EmbedCardNodeViewProps = Pick<SmartCardProps, 'eventDispatcher' | 'allowResizing' | 'platform' | 'fullWidthMode' | 'dispatchAnalyticsEvent'>;
export declare class EmbedCard extends SelectionBasedNodeView<EmbedCardNodeViewProps> {
    viewShouldUpdate(nextNode: PMNode): boolean;
    createDomRef(): HTMLElement;
    render(): JSX.Element;
}
