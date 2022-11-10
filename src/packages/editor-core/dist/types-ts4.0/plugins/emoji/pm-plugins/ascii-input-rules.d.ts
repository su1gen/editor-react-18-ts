import { Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { FeatureFlags } from '../../../types/feature-flags';
export declare function inputRulePlugin(schema: Schema, providerFactory: ProviderFactory, featureFlags: FeatureFlags): SafePlugin | undefined;
export declare const stateKey: PluginKey<any, any>;
declare const plugins: (schema: Schema, providerFactory: ProviderFactory, featureFlags: FeatureFlags) => SafePlugin<any, any>[];
export default plugins;
