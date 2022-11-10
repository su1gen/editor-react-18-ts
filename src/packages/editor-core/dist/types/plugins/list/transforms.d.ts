import { Fragment, Slice, Schema, Mark } from 'prosemirror-model';
import { Transaction, Selection } from 'prosemirror-state';
export declare function liftFollowingList(from: number, to: number, rootListDepth: number, tr: Transaction): Transaction;
export declare function liftNodeSelectionList(selection: Selection, tr: Transaction): Transaction<any>;
export declare function liftTextSelectionList(selection: Selection, tr: Transaction): Transaction;
/**
 * Walks the slice, creating paragraphs that were previously separated by hardbreaks.
 * Returns the original paragraph node (as a fragment), or a fragment containing multiple nodes.
 */
export declare const splitIntoParagraphs: ({ fragment, blockMarks, schema, }: {
    fragment: Fragment;
    blockMarks?: Mark<any>[] | undefined;
    schema: Schema;
}) => Fragment;
export declare const splitParagraphs: (slice: Slice, schema: Schema) => Slice;
export declare const upgradeTextToLists: (slice: Slice, schema: Schema) => Slice;
