import { Node as PMNode } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { Dispatch, EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
export interface TaskDecisionPluginState {
    currentTaskDecisionItem: PMNode | undefined;
    contextIdentifierProvider?: ContextIdentifierProvider;
}
export declare function createPlugin(portalProviderAPI: PortalProviderAPI, eventDispatcher: EventDispatcher, providerFactory: ProviderFactory, dispatch: Dispatch, useLongPressSelection?: boolean): SafePlugin<any, any>;
