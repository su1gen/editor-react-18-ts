import { Slice, Schema } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
export declare function insertSliceForLists({ tr, slice, schema, }: {
    tr: Transaction;
    slice: Slice;
    schema: Schema;
}): void | Transaction<any>;
