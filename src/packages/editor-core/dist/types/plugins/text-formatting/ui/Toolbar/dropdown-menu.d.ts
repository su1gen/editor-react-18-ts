import React from 'react';
import { EditorView } from 'prosemirror-view';
import { MenuIconItem } from './types';
declare type DropdownMenuProps = {
    editorView: EditorView;
    isReducedSpacing: boolean;
    items: Array<MenuIconItem>;
    moreButtonLabel: string;
    hasFormattingActive: boolean;
    popupsBoundariesElement?: HTMLElement;
    popupsMountPoint?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
};
export declare const FormattingTextDropdownMenu: React.FC<DropdownMenuProps>;
export {};
