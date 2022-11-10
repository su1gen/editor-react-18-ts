import { RelativeSelectionPos } from '@atlaskit/editor-common/selection';
import type { Transaction, Selection, EditorState } from 'prosemirror-state';
import type { SelectionPluginState } from '../plugins/selection/types';
export declare type EditorSelectionAPI = {
    setSelectionRelativeToNode: (props: {
        selectionRelativeToNode?: RelativeSelectionPos;
        selection?: Selection | null;
    }) => (state: EditorState) => Transaction;
    getSelectionPluginState: (state: EditorState) => SelectionPluginState;
};
export declare const createEditorSelectionAPI: () => EditorSelectionAPI;
