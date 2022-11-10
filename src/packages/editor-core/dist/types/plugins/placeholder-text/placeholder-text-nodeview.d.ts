import { NodeView, EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { getPosHandler } from '../../nodeviews';
declare type PmMutationRecord = MutationRecord | {
    type: 'selection';
    target: Element;
};
export declare class PlaceholderTextNodeView implements NodeView {
    private readonly node;
    private readonly view;
    private readonly getPos;
    readonly dom: Node;
    constructor(node: PMNode, view: EditorView, getPos: getPosHandler);
    stopEvent(e: Event): boolean;
    ignoreMutation(record: PmMutationRecord): boolean;
}
export {};
