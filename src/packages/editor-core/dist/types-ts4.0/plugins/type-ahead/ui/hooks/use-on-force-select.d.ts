import type { EditorView } from 'prosemirror-view';
import { TypeAheadHandler, TypeAheadItem } from '../../types';
declare type Props = {
    triggerHandler: TypeAheadHandler;
    items: Array<TypeAheadItem>;
    query: string;
    editorView: EditorView;
    closePopup: () => void;
};
export declare const useOnForceSelect: ({ triggerHandler, items, query, editorView, closePopup, }: Props) => void;
export {};
