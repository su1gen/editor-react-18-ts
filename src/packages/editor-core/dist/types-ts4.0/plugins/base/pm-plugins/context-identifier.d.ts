import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey, EditorState } from 'prosemirror-state';
import { Dispatch } from '../../../event-dispatcher';
export declare const stateKey: PluginKey<any, any>;
export interface PluginState {
    contextIdentifierProvider?: ContextIdentifierProvider;
}
export declare const getContextIdentifier: (state?: EditorState<any> | undefined) => ContextIdentifierProvider | undefined;
declare const _default: (dispatch: Dispatch, providerFactory?: ProviderFactory | undefined) => SafePlugin<any, any>;
export default _default;
