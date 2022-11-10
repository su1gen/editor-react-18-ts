import { InputRuleWrapper } from '@atlaskit/prosemirror-input-rules';
import { Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { FeatureFlags } from '../../../types/feature-flags';
export declare function createLinkInputRule(regexp: RegExp, skipAnalytics?: boolean): InputRuleWrapper;
export declare function createInputRulePlugin(schema: Schema, skipAnalytics: boolean | undefined, featureFlags: FeatureFlags): SafePlugin | undefined;
export default createInputRulePlugin;
