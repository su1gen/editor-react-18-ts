import { EditorView } from 'prosemirror-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { ExtensionHandlers, ExtensionProvider, UpdateExtension } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { EditorAppearance } from '../../../types/editor-appearance';
import { Dispatch, EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { getPluginState, createCommand } from '../plugin-factory';
import { pluginKey } from '../plugin-key';
export declare const updateEditButton: (view: EditorView, extensionProvider: ExtensionProvider) => Promise<UpdateExtension<any> | undefined>;
export declare const createExtensionProviderHandler: (view: EditorView) => (name: string, provider?: Promise<ExtensionProvider<any>> | undefined) => Promise<void>;
export declare const createContextIdentifierProviderHandler: (view: EditorView) => (name: string, provider?: Promise<ContextIdentifierProvider> | undefined) => Promise<void>;
declare const createPlugin: (dispatch: Dispatch, providerFactory: ProviderFactory, extensionHandlers: ExtensionHandlers, portalProviderAPI: PortalProviderAPI, eventDispatcher: EventDispatcher, useLongPressSelection?: boolean, options?: {
    appearance?: EditorAppearance;
}) => SafePlugin<import("../types").ExtensionState<import("@atlaskit/editor-common/extensions").Parameters>, import("prosemirror-model").Schema<any, any>>;
export { pluginKey, createPlugin, createCommand, getPluginState };
