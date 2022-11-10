import { Transaction } from 'prosemirror-state';
import type { InsertionTransactionMeta } from '../types';
import { ACTIONS } from './actions';
export declare const isInsertionTransaction: (transactions: Transaction[], action: ACTIONS) => InsertionTransactionMeta | null;
