import { NodeType } from 'prosemirror-model';
import { Schema, Node as PMNode } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
export declare function getSelectedNodeOrNodeParentByNodeType({ nodeType, selection, }: {
    nodeType: NodeType | Array<NodeType>;
    selection: Transaction['selection'];
}): import("prosemirror-utils").ContentNodeWithPos | undefined;
export declare const toDOM: (node: PMNode, schema: Schema) => Node;
