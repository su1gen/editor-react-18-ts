import type { NodeType, Node as PMNode } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState, Transaction } from 'prosemirror-state';
import { AnalyticsEventPayload } from '../plugins/analytics/types';
import { InputRuleWrapper, InputRuleHandler } from '@atlaskit/prosemirror-input-rules';
declare type GetPayload = AnalyticsEventPayload | ((state: EditorState, matchResult: RegExpExecArray) => AnalyticsEventPayload);
export declare const ruleWithAnalytics: (getPayload: GetPayload) => (originalRule: InputRuleWrapper) => InputRuleWrapper;
export declare const ruleWithTransform: (transform: (state: EditorState, tr: Transaction) => void) => (originalRule: InputRuleWrapper) => InputRuleWrapper;
export declare const createRule: (match: RegExp, handler: InputRuleHandler) => InputRuleWrapper;
declare type Options = {
    isBlockNodeRule?: boolean;
    allowInsertTextOnDocument?: boolean;
};
export declare const createPlugin: (pluginName: string, rules: Array<InputRuleWrapper>, options?: Options) => SafePlugin;
declare type WrappingTextRuleProps = {
    match: RegExp;
    nodeType: NodeType;
    getAttrs?: Record<string, any> | ((matchResult: RegExpExecArray) => Record<string, any>);
};
export declare const createWrappingTextBlockRule: ({ match, nodeType, getAttrs, }: WrappingTextRuleProps) => InputRuleWrapper;
declare type WrappingRuleProps = {
    match: RegExp;
    nodeType: NodeType;
    getAttrs?: Record<string, any> | ((matchResult: RegExpExecArray) => Record<string, any>);
    joinPredicate?: (matchResult: RegExpExecArray, node: PMNode) => boolean;
};
export declare const createWrappingJoinRule: ({ match, nodeType, getAttrs, joinPredicate, }: WrappingRuleProps) => InputRuleWrapper;
export declare const createJoinNodesRule: (match: RegExp, nodeType: NodeType) => InputRuleWrapper;
export {};
