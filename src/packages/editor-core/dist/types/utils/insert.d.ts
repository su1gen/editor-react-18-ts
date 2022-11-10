import { Node, Fragment, NodeType } from 'prosemirror-model';
import { Transaction, EditorState } from 'prosemirror-state';
export declare type InsertableContent = Node | Fragment;
export declare enum LookDirection {
    Before = "before",
    After = "after"
}
export declare const safeInsert: (content: InsertableContent, position?: number | undefined) => (tr: Transaction) => Transaction<any> | null;
/**
 * Method extracted from typeahed plugin to be shared with the element browser on handling element insertion.
 */
export declare const insertSelectedItem: (maybeNode?: string | Object | Node<any> | Fragment<any> | undefined, opts?: {
    selectInlineNode?: boolean;
}) => (state: EditorState, tr: Transaction<any>, start: number) => Transaction<any>;
/**
 * ED-14584: Util to check if the destination node is a paragraph & the
 * content being inserted is a valid child of the grandparent node.
 * In this case, the destination node should split
 */
export declare const shouldSplitSelectedNodeOnNodeInsertion: ({ parentNodeType, grandParentNodeType, content, }: {
    parentNodeType: NodeType<any>;
    grandParentNodeType: NodeType<any>;
    content: Node;
}) => boolean;
