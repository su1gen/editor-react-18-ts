import { Node } from 'prosemirror-model';
import { Transaction } from 'prosemirror-state';
/**
 * Checks whether two adjacent nodes can be joined. If so, the document
 * will be updated to join those nodes. If not, the original transaction
 * remains untouched.
 *
 * Nodes are considered joinable if the `isJoinable` predicate returns true or,
 * if an array of strings was passed, if their node type name is in that array.
 *
 * Adapted from https://github.com/ProseMirror/prosemirror-commands/blob/master/src/commands.js#L597-L610
 */
export declare function autoJoinTr(tr: Transaction, isJoinable: ((before: Node, after: Node) => boolean) | string[]): void;
