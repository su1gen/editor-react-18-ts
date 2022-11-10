import { NodeType } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
/**
 * Wraps the selection in a list with the given type. If this results in
 * two adjacent lists of the same type, those will be joined together.
 */
export declare function wrapInListAndJoin(nodeType: NodeType, tr: Transaction): void;
/**
 * Wraps the selection in a list with the given type and attributes.
 *
 * Adapted from https://github.com/ProseMirror/prosemirror-schema-list/blob/master/src/schema-list.js#L64-L89
 */
export declare function wrapInList(listType: NodeType, attrs?: {
    [key: string]: any;
}): (tr: Transaction) => boolean;
