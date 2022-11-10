import { FeatureFlags } from '../../../types/feature-flags';
import { Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
export declare function inputRulePlugin(schema: Schema, featureFlags: FeatureFlags): SafePlugin;
export default inputRulePlugin;
