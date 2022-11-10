import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
import { Dispatch } from '../../event-dispatcher';
export declare const pluginKey: PluginKey<MaxContentSizePluginState, any>;
export declare type MaxContentSizePluginState = {
    maxContentSizeReached: boolean;
};
export declare function createPlugin(dispatch: Dispatch, maxContentSize?: number): SafePlugin | undefined;
declare const maxContentSizePlugin: (maxContentSize?: number | undefined) => EditorPlugin;
export default maxContentSizePlugin;
