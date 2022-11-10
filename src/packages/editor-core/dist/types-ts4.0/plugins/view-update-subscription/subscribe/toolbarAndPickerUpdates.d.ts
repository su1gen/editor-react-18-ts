import { EditorView } from 'prosemirror-view';
import { DatePluginState } from '../../date/pm-plugins/types';
import { ConfigWithNodeInfo } from '../../floating-toolbar';
import { StatusState } from '../../status/types';
declare type SubscribeToToolbarAndPickerUpdatesCallbackArgs = {
    dateState: DatePluginState;
    statusState: StatusState;
    toolbarConfig: ConfigWithNodeInfo | null | undefined;
};
declare type SubscribeToToolbarAndPickerUpdates = (editorView: EditorView, cb: (args: SubscribeToToolbarAndPickerUpdatesCallbackArgs) => void) => () => void;
export declare const subscribeToToolbarAndPickerUpdates: SubscribeToToolbarAndPickerUpdates;
export {};
