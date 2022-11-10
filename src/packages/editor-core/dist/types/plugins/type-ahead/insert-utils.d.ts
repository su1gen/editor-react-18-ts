import { Transaction } from 'prosemirror-state';
import { Node as PMNode, Fragment } from 'prosemirror-model';
declare type Position = {
    start: number;
    end: number;
};
export declare const insertBlockNode: ({ node, tr, position, }: {
    node: PMNode;
    tr: Transaction;
    position: Position;
}) => Transaction;
export declare const insertInlineNodeOrFragment: ({ maybeFragment, tr, position, selectInlineNode, }: {
    maybeFragment: Fragment | PMNode;
    tr: Transaction;
    position: Position;
    selectInlineNode: boolean;
}) => Transaction;
export {};
