/// <reference types="react" />
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { InlineNodeViewComponentProps } from '../../../nodeviews/getInlineNodeViewProducer';
export declare type Props = InlineNodeViewComponentProps & {
    providerFactory: ProviderFactory;
};
export declare function EmojiNodeView(props: Props): JSX.Element;
