import React from 'react';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { MentionPluginOptions } from '../types';
import { InlineNodeViewComponentProps } from '../../../nodeviews/getInlineNodeViewProducer';
export declare type Props = InlineNodeViewComponentProps & {
    options: MentionPluginOptions | undefined;
    providerFactory: ProviderFactory;
};
export declare const MentionNodeView: React.FC<Props>;
