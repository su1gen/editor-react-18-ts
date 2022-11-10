import React from 'react';
import { EditorView } from 'prosemirror-view';
import { OnInsert } from '../../../../ui/ElementBrowser/types';
import { BlockMenuItem } from './create-items';
export interface BlockInsertMenuProps {
    disabled: boolean;
    editorView: EditorView;
    items: BlockMenuItem[];
    label: string;
    open: boolean;
    plusButtonRef?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    popupsMountPoint?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
    replacePlusMenuWithElementBrowser: boolean;
    spacing: 'none' | 'default';
    onRef(el: HTMLElement): void;
    onPlusButtonRef(el: HTMLElement): void;
    onClick: React.MouseEventHandler;
    onItemActivated(attrs: any): void;
    onInsert: OnInsert;
    onOpenChange(attrs: any): void;
    togglePlusMenuVisibility(): void;
}
export declare const BlockInsertMenu: React.FC<BlockInsertMenuProps>;
