import { EditorView } from 'prosemirror-view';
import type { TypeAheadPluginState } from '../../type-ahead/types';
declare type Props = {
    oldPluginState: TypeAheadPluginState;
    newPluginState: TypeAheadPluginState;
};
declare type SubscribeTypeAheadUpdates = (editorView: EditorView, cb: (props: Props) => void) => () => void;
export declare const subscribeTypeAheadUpdates: SubscribeTypeAheadUpdates;
export {};
