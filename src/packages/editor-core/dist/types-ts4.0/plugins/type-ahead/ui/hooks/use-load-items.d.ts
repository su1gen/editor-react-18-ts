import type { EditorView } from 'prosemirror-view';
import type { TypeAheadItem, TypeAheadHandler } from '../../types';
export declare const useLoadItems: (triggerHandler: TypeAheadHandler, editorView: EditorView, query: string) => Array<TypeAheadItem>;
