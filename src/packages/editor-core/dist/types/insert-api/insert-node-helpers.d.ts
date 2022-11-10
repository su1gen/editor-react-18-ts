import { Transaction } from 'prosemirror-state';
import { Node as PMNode, Fragment, ResolvedPos } from 'prosemirror-model';
declare type Position = {
    $from: ResolvedPos;
    $to: ResolvedPos;
};
declare type InsertBlockNodeProps = {
    node: PMNode;
    tr: Transaction;
    position: Position;
};
export declare const insertBlockNode: ({ node, tr, position, }: InsertBlockNodeProps) => Transaction;
declare type InsertInlineNodeOrFragmentProps = {
    maybeFragment: Fragment | PMNode;
    tr: Transaction;
    position: Position;
    selectInlineNode: boolean;
};
export declare const insertInlineNodeOrFragment: ({ maybeFragment, tr, position, selectInlineNode, }: InsertInlineNodeOrFragmentProps) => Transaction;
declare type InsertProseMirrorContentProps = {
    tr: Transaction;
    node: PMNode | Fragment;
    position: {
        $from: ResolvedPos;
        $to: ResolvedPos;
    };
    selectNodeInserted: boolean;
};
export declare const insertProseMirrorContent: ({ tr, node, position, selectNodeInserted, }: InsertProseMirrorContentProps) => void;
export {};
