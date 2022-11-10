/** @jsx jsx */
import React from 'react';
import type { EditorView } from 'prosemirror-view';
import { CloseSelectionOptions } from '../constants';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
declare type InputQueryProps = {
    triggerQueryPrefix: string;
    onQueryChange: (query: string) => void;
    onItemSelect: (mode: SelectItemMode) => void;
    selectNextItem: () => void;
    selectPreviousItem: () => void;
    cancel: (props: {
        forceFocusOnEditor: boolean;
        setSelectionAt: CloseSelectionOptions;
        addPrefixTrigger: boolean;
        text: string;
    }) => void;
    onQueryFocus: () => void;
    forceFocus: boolean;
    onUndoRedo?: (inputType: 'historyUndo' | 'historyRedo') => boolean;
    reopenQuery?: string;
    editorView: EditorView;
    items: any[];
};
export declare const InputQuery: React.FC<InputQueryProps>;
export {};
