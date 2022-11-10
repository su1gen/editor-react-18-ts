/** @jsx jsx */
import React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { UnsupportedContentTooltipPayload } from '@atlaskit/editor-common/utils';
import { InlineNodeViewComponentProps } from '../../nodeviews/getInlineNodeViewProducer';
export declare type Props = InlineNodeViewComponentProps & {
    node?: PMNode;
    children?: React.ReactNode;
    dispatchAnalyticsEvent?: (payload: UnsupportedContentTooltipPayload) => void;
};
export declare const UnsupportedInlineNodeView: React.FC<Props>;
