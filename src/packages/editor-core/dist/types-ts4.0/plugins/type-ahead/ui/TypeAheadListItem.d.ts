/** @jsx jsx */
import React from 'react';
import type { TypeAheadItem } from '../types';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
export declare const ICON_HEIGHT = 40;
export declare const ICON_WIDTH = 40;
export declare const ITEM_PADDING = 12;
export declare const itemIcon: import("@emotion/react").SerializedStyles;
declare type TypeAheadListItemProps = {
    item: TypeAheadItem;
    itemsLength: number;
    itemIndex: number;
    selectedIndex: number;
    onItemClick: (mode: SelectItemMode, index: number) => void;
};
export declare const TypeAheadListItem: React.FC<TypeAheadListItemProps>;
export {};
