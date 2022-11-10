import { Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { FeatureFlags } from '../../../types/feature-flags';
export declare function inputRulePlugin(schema: Schema, featureFlags: FeatureFlags): SafePlugin | undefined;
export default inputRulePlugin;
