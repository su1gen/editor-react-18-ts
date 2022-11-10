import { Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { CardOptions } from '@atlaskit/editor-common/card';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { DispatchAnalyticsEvent } from '../../analytics';
export { pluginKey as stateKey } from './plugin-factory';
export { md } from '../md';
import type { Dispatch } from '../../../event-dispatcher';
export declare function createPlugin(schema: Schema, dispatchAnalyticsEvent: DispatchAnalyticsEvent, dispatch: Dispatch, plainTextPasteLinkification?: boolean, cardOptions?: CardOptions, sanitizePrivateContent?: boolean, providerFactory?: ProviderFactory): SafePlugin<import("../types").PastePluginState, Schema<any, any>>;
