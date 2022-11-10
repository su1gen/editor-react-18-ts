import { EditorState, Transaction } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { EditorPlugin } from '../../types';
declare type UpdateArgs = {
    newEditorState: EditorState;
    oldEditorState: EditorState;
    transactions: Transaction[];
};
export declare type ViewUpdateSubscription = (args: UpdateArgs) => void;
export declare const trackerStore: WeakMap<EditorView<any>, Tracker>;
declare class Tracker {
    private subscriptions;
    constructor();
    update: (props: UpdateArgs) => void;
    add: (subscription: ViewUpdateSubscription) => void;
    remove: (subscription: ViewUpdateSubscription) => void;
}
declare const createViewUpdateSubscriptionPlugin: () => EditorPlugin;
export default createViewUpdateSubscriptionPlugin;
