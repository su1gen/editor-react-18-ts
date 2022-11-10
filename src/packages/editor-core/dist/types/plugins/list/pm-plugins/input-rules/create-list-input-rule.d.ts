import { NodeType } from 'prosemirror-model';
declare type Props = {
    listType: NodeType;
    expression: RegExp;
};
export declare function createRuleForListType({ listType, expression }: Props): import("@atlaskit/prosemirror-input-rules").InputRuleWrapper;
export {};
