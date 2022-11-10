import { EditorState } from 'prosemirror-state';
import { Decoration, EditorView } from 'prosemirror-view';
import { TypeAheadAvailableNodes } from '@atlaskit/editor-common/type-ahead';
import type { TypeAheadHandler, TypeAheadPluginState } from './types';
export declare const findTypeAheadDecorations: (state: EditorState) => Decoration | null;
export declare const isTypeAheadHandler: (handler: any) => handler is TypeAheadHandler;
export declare const isTypeAheadOpen: (editorState: EditorState) => boolean;
export declare const getPluginState: (editorState: EditorState) => TypeAheadPluginState;
export declare const getTypeAheadHandler: (editorState: EditorState) => any;
export declare const getTypeAheadQuery: (editorState: EditorState) => any;
export declare const isTypeAheadAllowed: (state: EditorState) => boolean;
export declare const findHandler: (id: TypeAheadAvailableNodes, state: EditorState) => TypeAheadHandler | null;
export declare const findHandlerByTrigger: ({ trigger, editorState, }: {
    trigger: string;
    editorState: EditorState;
}) => TypeAheadHandler | null;
declare type MoveSelectedIndexProps = {
    editorView: EditorView;
    direction: 'next' | 'previous';
};
export declare const moveSelectedIndex: ({ editorView, direction, }: MoveSelectedIndexProps) => () => void;
export {};
