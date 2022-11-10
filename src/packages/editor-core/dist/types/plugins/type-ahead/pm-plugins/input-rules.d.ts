import { Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { TypeAheadHandler } from '../types';
import type { FeatureFlags } from '../../../types/feature-flags';
export declare function inputRulePlugin(schema: Schema, typeAheads: TypeAheadHandler[], featureFlags: FeatureFlags): SafePlugin | undefined;
export default inputRulePlugin;
