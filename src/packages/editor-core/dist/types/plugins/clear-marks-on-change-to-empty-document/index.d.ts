import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
export declare const pluginKey: PluginKey<any, any>;
export declare function createPlugin(): SafePlugin;
declare const clearMarksOnChangeToEmptyDocumentPlugin: () => EditorPlugin;
export default clearMarksOnChangeToEmptyDocumentPlugin;
