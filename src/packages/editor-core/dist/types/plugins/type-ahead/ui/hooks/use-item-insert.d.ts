import type { EditorView } from 'prosemirror-view';
import type { TypeAheadHandler, TypeAheadItem, OnItemMatch, OnTextInsert, OnInsertSelectedItem } from '../../types';
export declare const useItemInsert: (triggerHandler: TypeAheadHandler, editorView: EditorView, items: Array<TypeAheadItem>) => [OnInsertSelectedItem, OnTextInsert, OnItemMatch];
