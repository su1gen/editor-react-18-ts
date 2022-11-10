import { EditorState } from 'prosemirror-state';
import { Command } from '../../../src/types';
import { FloatingToolbarButton, FloatingToolbarItem, MarkOptions, NodeOptions } from '../floating-toolbar/types';
export declare function getCopyButtonConfig(options: MarkOptions | NodeOptions): FloatingToolbarButton<Command>;
export declare const showCopyButton: (state?: EditorState<any> | undefined) => import("prosemirror-state").Plugin<any, any> | undefined;
/**
 * Process floatingToolbar items for copyButton
 *
 * If copy button plugin not enabled, remove copy button item from toolbar items
 * else process copy button to standard floatingtoobarbutton
 */
export declare function processCopyButtonItems(state: EditorState): (items: Array<FloatingToolbarItem<Command>>) => Array<FloatingToolbarItem<Command>>;
