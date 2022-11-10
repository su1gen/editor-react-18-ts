import { EditorState } from 'prosemirror-state';
import { NodeWithPos } from 'prosemirror-utils';
declare type FindNodesByIdsOption = {
    includeDocNode?: boolean;
};
export declare const findNodePosByLocalIds: (state: EditorState, ids: string[], option?: FindNodesByIdsOption) => NodeWithPos[];
export declare const findNodePosByFragmentLocalIds: (state: EditorState, ids: string[]) => NodeWithPos[];
export {};
