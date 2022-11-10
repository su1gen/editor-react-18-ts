import { EditorState } from 'prosemirror-state';
declare type NodeCount = Record<string, number>;
declare type NodesCount = {
    nodeCount: NodeCount;
    extensionNodeCount: NodeCount;
};
export declare function countNodes(state: EditorState): NodesCount;
export {};
