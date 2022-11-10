import { Node as PMNode, Slice } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
export declare function insertSliceIntoEmptyNode({ tr, slice, }: {
    tr: Transaction;
    slice: Slice;
}): void;
export declare function insertSliceAtNodeEdge({ tr, slice, }: {
    tr: Transaction;
    slice: Slice;
}): void;
export declare function insertSliceIntoRangeSelectionInsideList({ tr, slice, }: {
    tr: Transaction;
    slice: Slice;
}): Transaction<any> | undefined;
export declare function insertSliceInsideOfPanelNodeSelected(panelNode: PMNode): ({ tr, slice }: {
    tr: Transaction;
    slice: Slice;
}) => void;
