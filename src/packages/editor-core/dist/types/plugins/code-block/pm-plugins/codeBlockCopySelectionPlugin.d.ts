import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import type { EditorState, Transaction } from 'prosemirror-state';
export declare const copySelectionPluginKey: PluginKey<any, any>;
declare type CodeBlockCopySelectionPluginState = {
    decorationStartAndEnd?: [start: number, end: number];
};
export declare function codeBlockCopySelectionPlugin(): SafePlugin<CodeBlockCopySelectionPluginState, any>;
export declare function provideVisualFeedbackForCopyButton(state: EditorState, dispatch?: (tr: Transaction) => void): boolean;
export declare function removeVisualFeedbackForCopyButton(state: EditorState, dispatch?: (tr: Transaction) => void): boolean;
export {};
