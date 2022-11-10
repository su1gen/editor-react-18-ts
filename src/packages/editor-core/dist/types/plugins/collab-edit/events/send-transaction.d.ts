import type { CollabEditProvider } from '@atlaskit/editor-common/collab';
import { Transaction, EditorState } from 'prosemirror-state';
declare type Props = {
    originalTransaction: Transaction;
    transactions: Transaction[];
    oldEditorState: EditorState;
    newEditorState: EditorState;
    useNativePlugin: boolean;
};
export declare const sendTransaction: ({ originalTransaction, transactions, oldEditorState, newEditorState, useNativePlugin, }: Props) => (provider: CollabEditProvider) => void;
export {};
