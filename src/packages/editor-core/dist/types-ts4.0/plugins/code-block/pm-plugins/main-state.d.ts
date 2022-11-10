import { EditorState } from 'prosemirror-state';
import { CommandDispatch } from '../../../types';
export declare type CodeBlockState = {
    pos: number | null;
    contentCopied: boolean;
    isNodeSelected: boolean;
    shouldIgnoreFollowingMutations: boolean;
};
export declare const getPluginState: (state: EditorState) => CodeBlockState;
export declare const setPluginState: (stateProps: Object) => (state: EditorState, dispatch: CommandDispatch) => boolean;
export declare type CodeBlockStateSubscriber = (state: CodeBlockState) => any;
