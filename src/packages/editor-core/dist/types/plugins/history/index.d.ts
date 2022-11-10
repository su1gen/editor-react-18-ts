import { PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { HistoryPluginState } from './types';
/**
 * Plugin that keeps track of whether undo and redo are currently available
 * This is needed so we can enable/disable controls appropriately
 *
 * Actual undo/redo functionality is handled by prosemirror-history:
 * https://github.com/ProseMirror/prosemirror-history
 */
export declare const historyPluginKey: PluginKey<HistoryPluginState, any>;
declare const historyPlugin: () => EditorPlugin;
export default historyPlugin;
