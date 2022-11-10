import React from 'react';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { EmojiId } from '@atlaskit/emoji';
export declare const EmojiPickerButton: React.FunctionComponent<{
    className?: string;
    editorView?: EditorView;
    idx?: number;
    providerFactory?: ProviderFactory;
    title?: string;
    onChange?: (emoji: EmojiId) => void;
    isSelected?: boolean;
    mountPoint?: HTMLElement;
    setDisableParentScroll?: (disable: boolean) => void;
}>;
