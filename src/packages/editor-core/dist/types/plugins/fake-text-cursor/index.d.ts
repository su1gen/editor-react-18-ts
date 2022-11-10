import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { EditorPlugin } from '../../types';
export declare const stateKey: PluginKey<any, any>;
export declare const createPlugin: () => SafePlugin<any, any>;
declare const fakeTextCursorPlugin: () => EditorPlugin;
export default fakeTextCursorPlugin;
