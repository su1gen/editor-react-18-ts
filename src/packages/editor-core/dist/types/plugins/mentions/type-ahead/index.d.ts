import React from 'react';
import { MentionDescription } from '@atlaskit/mention/resource';
import type { TypeAheadHandler, TypeAheadItem } from '../../type-ahead/types';
import type { FireElementsChannelEvent } from '../types';
export declare const mentionToTypeaheadItem: (mention: MentionDescription) => TypeAheadItem;
export declare function memoize<ResultFn extends (mention: MentionDescription) => TypeAheadItem>(fn: ResultFn): {
    call: ResultFn;
    clear(): void;
};
declare type Props = {
    sanitizePrivateContent?: boolean;
    mentionInsertDisplayName?: boolean;
    HighlightComponent?: React.ComponentType;
    fireEvent: FireElementsChannelEvent;
};
export declare const createTypeAheadConfig: ({ sanitizePrivateContent, mentionInsertDisplayName, fireEvent, HighlightComponent, }: Props) => TypeAheadHandler;
export {};
