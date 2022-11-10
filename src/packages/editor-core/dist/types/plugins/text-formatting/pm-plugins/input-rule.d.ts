import { Schema } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { FeatureFlags } from '../../../types/feature-flags';
declare enum ValidAutoformatChars {
    STRONG = "__",
    STRIKE = "~~",
    STRONG_MARKDOWN = "**",
    ITALIC_MARKDOWN = "*",
    ITALIC = "_",
    CODE = "`"
}
export declare const ValidCombinations: Record<ValidAutoformatChars, string[]>;
declare class ReverseRegexExp extends RegExp {
    exec(str: string): RegExpExecArray | null;
}
export declare const strongRegex1: ReverseRegexExp;
export declare const strongRegex2: ReverseRegexExp;
export declare const italicRegex1: ReverseRegexExp;
export declare const italicRegex2: ReverseRegexExp;
export declare const strikeRegex: ReverseRegexExp;
export declare const codeRegex: ReverseRegexExp;
export declare function inputRulePlugin(schema: Schema, featureFlags: FeatureFlags): SafePlugin | undefined;
export default inputRulePlugin;
