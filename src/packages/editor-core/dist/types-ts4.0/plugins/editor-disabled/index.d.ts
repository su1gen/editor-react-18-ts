import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';
export declare type EditorDisabledPluginState = {
    editorDisabled: boolean;
};
export declare const pluginKey: PluginKey<EditorDisabledPluginState, any>;
export declare function createPlugin(dispatch: Dispatch<EditorDisabledPluginState>): SafePlugin | undefined;
declare const editorDisabledPlugin: () => EditorPlugin;
export default editorDisabledPlugin;
