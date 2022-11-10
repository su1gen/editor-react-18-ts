import type { EditorView } from 'prosemirror-view';
import { SelectItemMode } from '@atlaskit/editor-common/type-ahead';
import type { TypeAheadHandler, TypeAheadItem } from '../types';
declare type Props = {
    item: TypeAheadItem;
    handler: TypeAheadHandler;
    mode: SelectItemMode;
    sourceListItem: Array<TypeAheadItem>;
    query: string;
};
export declare const insertTypeAheadItem: (view: EditorView) => ({ item, handler, mode, query, sourceListItem, }: Props) => void;
export {};
