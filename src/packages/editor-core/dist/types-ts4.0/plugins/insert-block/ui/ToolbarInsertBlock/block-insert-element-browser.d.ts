import React from 'react';
import { EditorView } from 'prosemirror-view';
import { BlockMenuItem } from './create-items';
import { OnInsert } from '../../../../ui/ElementBrowser/types';
export interface BlockInsertElementBrowserProps {
    disabled: boolean;
    editorView: EditorView;
    items: BlockMenuItem[];
    spacing: 'none' | 'default';
    label: string;
    open: boolean;
    popupsBoundariesElement?: HTMLElement;
    popupsMountPoint?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
    plusButtonRef?: HTMLElement;
    onRef(el: HTMLElement): void;
    onClick: React.MouseEventHandler;
    onInsert: OnInsert;
    togglePlusMenuVisibility(): void;
}
export declare const BlockInsertElementBrowser: React.FC<BlockInsertElementBrowserProps>;
