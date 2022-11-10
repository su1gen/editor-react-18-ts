import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState, PluginKey } from 'prosemirror-state';
import { EmojiDescription, EmojiProvider } from '@atlaskit/emoji';
import type { Command, EditorPlugin, PMPluginFactoryParams } from '../../types';
import { TypeAheadItem } from '../type-ahead/types';
import { EmojiPluginOptions, EmojiPluginState } from './types';
export declare const emojiToTypeaheadItem: (emoji: EmojiDescription, emojiProvider?: EmojiProvider | undefined) => TypeAheadItem;
export declare function memoize<ResultFn extends (emoji: EmojiDescription, emojiProvider?: EmojiProvider) => TypeAheadItem>(fn: ResultFn): {
    call: ResultFn;
    clear(): void;
};
export declare const defaultListLimit = 50;
declare const emojiPlugin: (options?: EmojiPluginOptions | undefined) => EditorPlugin;
export default emojiPlugin;
/**
 * Actions
 */
export declare const ACTIONS: {
    SET_PROVIDER: string;
    SET_RESULTS: string;
    SET_ASCII_MAP: string;
};
export declare const setProvider: (provider?: EmojiProvider | undefined) => Command;
export declare const emojiPluginKey: PluginKey<EmojiPluginState, any>;
export declare function getEmojiPluginState(state: EditorState): EmojiPluginState;
export declare function createEmojiPlugin(pmPluginFactoryParams: PMPluginFactoryParams): SafePlugin<EmojiPluginState, any>;
