import { NodeType } from 'prosemirror-model';
import { EditorState, Transaction } from 'prosemirror-state';
import { INPUT_METHOD, USER_CONTEXT } from '../analytics';
import { LongPressSelectionPluginOptions } from '../selection/types';
export declare type TaskDecisionListType = 'taskList' | 'decisionList';
export declare type TaskDecisionInputMethod = INPUT_METHOD.TOOLBAR | INPUT_METHOD.INSERT_MENU | INPUT_METHOD.QUICK_INSERT | INPUT_METHOD.FORMATTING | INPUT_METHOD.KEYBOARD;
export declare type ContextData = {
    objectId: string;
    containerId: string;
    userContext: USER_CONTEXT;
};
export declare type AddItemTransactionCreator = (opts: {
    state: EditorState;
    tr: Transaction;
    list: NodeType;
    item: NodeType;
    listLocalId: string;
    itemLocalId: string;
}) => Transaction | null;
export interface TaskDecisionPluginOptions extends LongPressSelectionPluginOptions {
    allowNestedTasks?: boolean;
    consumeTabs?: boolean;
}
