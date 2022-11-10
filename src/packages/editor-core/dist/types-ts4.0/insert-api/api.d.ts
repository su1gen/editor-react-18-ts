import type { EditorView } from 'prosemirror-view';
import type { EditorPlugin } from '../types/editor-plugin';
import type { InsertNodeAPI } from './types';
declare type Props = {
    getEditorView: () => EditorView | undefined | null;
    getEditorPlugins: () => EditorPlugin[];
};
export declare const createInsertNodeAPI: ({ getEditorView, getEditorPlugins, }: Props) => InsertNodeAPI;
export {};
