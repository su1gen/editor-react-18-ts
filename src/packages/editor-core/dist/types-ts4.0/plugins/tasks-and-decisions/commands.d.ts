import { NodeType, ResolvedPos, Schema } from 'prosemirror-model';
import { EditorState, Selection, Transaction } from 'prosemirror-state';
import { Command } from '../../types';
import { INPUT_METHOD } from '../analytics';
import { TOOLBAR_MENU_TYPE } from '../insert-block/ui/ToolbarInsertBlock/types';
import { AddItemTransactionCreator, TaskDecisionInputMethod, TaskDecisionListType } from './types';
export declare const getListTypes: (listType: TaskDecisionListType, schema: Schema) => {
    list: NodeType;
    item: NodeType;
};
export declare const insertTaskDecisionAction: (state: EditorState, listType: TaskDecisionListType, inputMethod?: INPUT_METHOD.FORMATTING | INPUT_METHOD.QUICK_INSERT | TOOLBAR_MENU_TYPE, addItem?: AddItemTransactionCreator | undefined, listLocalId?: string | undefined, itemLocalId?: string | undefined) => Transaction;
export declare const insertTaskDecisionCommand: (listType: TaskDecisionListType, inputMethod?: INPUT_METHOD.FORMATTING | INPUT_METHOD.QUICK_INSERT | TOOLBAR_MENU_TYPE, addItem?: AddItemTransactionCreator | undefined, listLocalId?: string | undefined, itemLocalId?: string | undefined) => Command;
export declare const insertTaskDecisionWithAnalytics: (state: EditorState, listType: TaskDecisionListType, inputMethod: TaskDecisionInputMethod, addAndCreateList: AddItemTransactionCreator, addToList?: AddItemTransactionCreator | undefined, listLocalId?: string | undefined, itemLocalId?: string | undefined) => Transaction | null;
export declare const isSupportedSourceNode: (schema: Schema, selection: Selection) => boolean;
export declare const changeInDepth: (before: ResolvedPos, after: ResolvedPos) => number;
export declare const createListAtSelection: (tr: Transaction, list: any, item: any, schema: Schema, state: EditorState, listLocalId?: string, itemLocalId?: string) => Transaction | null;
