import React from 'react';
import { BlockMenuItem } from './create-items';
export interface BlockInsertMenuLegacyProps {
    disabled: boolean;
    spacing: 'none' | 'default';
    label: string;
    open: boolean;
    items: BlockMenuItem[];
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
    onClick: React.MouseEventHandler;
    onRef(el: HTMLElement): void;
    onItemActivated(attrs: any): void;
    onOpenChange(attrs: any): void;
}
export declare const BlockInsertMenuLegacy: React.FC<BlockInsertMenuLegacyProps>;
