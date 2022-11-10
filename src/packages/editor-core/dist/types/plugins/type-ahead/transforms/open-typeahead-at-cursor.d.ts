import { Transaction } from 'prosemirror-state';
import type { TypeAheadHandler, TypeAheadInputMethod } from '../types';
declare type Props = {
    triggerHandler: TypeAheadHandler;
    inputMethod: TypeAheadInputMethod;
    query?: string;
};
export declare const openTypeAhead: (props: Props) => (tr: Transaction) => void;
export declare const openTypeAheadAtCursor: ({ triggerHandler, inputMethod, query, }: Props) => (tr: Transaction) => Transaction | null;
export {};
