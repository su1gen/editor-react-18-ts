import { Schema, NodeType } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { FeatureFlags } from '../../../types/feature-flags';
import { InputRuleWrapper } from '@atlaskit/prosemirror-input-rules';
export declare function headingRule(nodeType: NodeType, maxLevel: number): InputRuleWrapper;
export declare function blockQuoteRule(nodeType: NodeType): InputRuleWrapper;
export declare function codeBlockRule(nodeType: NodeType): InputRuleWrapper;
export declare function inputRulePlugin(schema: Schema, featureFlags: FeatureFlags): SafePlugin | undefined;
export default inputRulePlugin;
