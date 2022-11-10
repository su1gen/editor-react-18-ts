import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorPlugin } from '../../types/editor-plugin';
import { Dispatch } from '../../event-dispatcher';
import { PlaceholderTextOptions, PluginState } from './types';
export declare function createPlugin(dispatch: Dispatch<PluginState>, options: PlaceholderTextOptions): SafePlugin | undefined;
declare const placeholderTextPlugin: (options: PlaceholderTextOptions) => EditorPlugin;
export default placeholderTextPlugin;
