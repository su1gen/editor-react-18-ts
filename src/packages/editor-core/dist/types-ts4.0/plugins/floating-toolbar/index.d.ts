import { PluginKey, Selection, EditorState } from 'prosemirror-state';
import { Node } from 'prosemirror-model';
import { EditorPlugin } from '../../types';
import { FloatingToolbarConfig } from './types';
export declare type FloatingToolbarPluginState = Record<'getConfigWithNodeInfo', (state: EditorState) => ConfigWithNodeInfo | null | undefined>;
export declare type ConfigWithNodeInfo = {
    config: FloatingToolbarConfig | undefined;
    pos: number;
    node: Node;
};
export declare const getRelevantConfig: (selection: Selection<any>, configs: Array<FloatingToolbarConfig>) => ConfigWithNodeInfo | undefined;
declare const floatingToolbarPlugin: () => EditorPlugin;
export default floatingToolbarPlugin;
/**
 *
 * ProseMirror Plugin
 *
 */
export declare const pluginKey: PluginKey<FloatingToolbarPluginState, any>;
