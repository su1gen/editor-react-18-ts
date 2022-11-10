import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Command } from '../../types';
import { TOOLBAR_MENU_TYPE } from '../insert-block/ui/ToolbarInsertBlock/types';
import { StatusType } from './types';
export declare const DEFAULT_STATUS: StatusType;
export declare const createStatus: (showStatusPickerAtOffset?: number) => (insert: (node: Node | Object | string, opts: {
    selectInlineNode: boolean;
}) => Transaction, state: EditorState) => Transaction;
export declare const updateStatus: (status?: StatusType | undefined) => Command;
export declare const updateStatusWithAnalytics: (inputMethod: TOOLBAR_MENU_TYPE, status?: StatusType | undefined) => Command;
export declare const setStatusPickerAt: (showStatusPickerAt: number | null) => (state: EditorState, dispatch: (tr: Transaction) => void) => boolean;
export declare const removeStatus: (showStatusPickerAt: number) => Command;
export declare const commitStatusPicker: () => (editorView: EditorView) => void;
