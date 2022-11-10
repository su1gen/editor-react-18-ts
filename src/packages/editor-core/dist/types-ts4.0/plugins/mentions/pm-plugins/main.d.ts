import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import type { Command, PMPluginFactoryParams } from '../../../types';
import type { MentionPluginOptions, MentionPluginState } from '../types';
export declare const setContext: (context: ContextIdentifierProvider | undefined) => Command;
export declare function createMentionPlugin(pmPluginFactoryParams: PMPluginFactoryParams, fireEvent: (payload: any) => void, options?: MentionPluginOptions): SafePlugin<MentionPluginState, import("prosemirror-model").Schema<any, any>>;
