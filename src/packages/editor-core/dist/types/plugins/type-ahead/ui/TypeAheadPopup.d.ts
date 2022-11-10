/** @jsx jsx */
import React from 'react';
import { EditorView, DecorationSet } from 'prosemirror-view';
import type { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { TypeAheadHandler, TypeAheadItem, OnSelectItem } from '../types';
import type { FireAnalyticsCallback } from '../../analytics/fire-analytics-event';
declare type TypeAheadPopupProps = {
    triggerHandler: TypeAheadHandler;
    editorView: EditorView;
    anchorElement: HTMLElement;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
    fireAnalyticsCallback: FireAnalyticsCallback;
    items: Array<TypeAheadItem>;
    selectedIndex: number;
    setSelectedItem: OnSelectItem;
    decorationSet: DecorationSet;
    isEmptyQuery: boolean;
    onItemInsert: (mode: SelectItemMode, index: number) => void;
};
export declare const TypeAheadPopup: React.FC<TypeAheadPopupProps>;
export {};
