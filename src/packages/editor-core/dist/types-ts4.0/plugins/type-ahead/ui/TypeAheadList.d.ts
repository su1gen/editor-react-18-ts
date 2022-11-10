/** @jsx jsx */
import React from 'react';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import { WrappedComponentProps } from 'react-intl-next';
import type { TypeAheadItem } from '../types';
import { EditorView } from 'prosemirror-view';
export declare const TypeAheadList: React.FC<import("react-intl-next").WithIntlProps<{
    items: Array<TypeAheadItem>;
    selectedIndex: number;
    editorView: EditorView;
    onItemClick: (mode: SelectItemMode, index: number) => void;
    fitHeight: number;
    decorationElement: HTMLElement;
} & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<{
        items: Array<TypeAheadItem>;
        selectedIndex: number;
        editorView: EditorView;
        onItemClick: (mode: SelectItemMode, index: number) => void;
        fitHeight: number;
        decorationElement: HTMLElement;
    } & WrappedComponentProps<"intl">>;
};
