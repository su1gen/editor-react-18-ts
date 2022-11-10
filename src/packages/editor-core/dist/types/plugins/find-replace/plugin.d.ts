import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { Dispatch } from '../../event-dispatcher';
import { FindReplacePluginState } from './types';
export declare const initialState: FindReplacePluginState;
export declare const createCommand: <A = import("./actions").FindReplaceAction>(action: A | ((state: Readonly<import("prosemirror-state").EditorState<any>>) => false | A), transform?: ((tr: import("prosemirror-state").Transaction<any>, state: import("prosemirror-state").EditorState<any>) => import("prosemirror-state").Transaction<any>) | undefined) => import("@atlaskit/editor-common/types").Command, getPluginState: (state: import("prosemirror-state").EditorState<any>) => FindReplacePluginState, createPluginState: (dispatch: Dispatch<any>, initialState: FindReplacePluginState | ((state: import("prosemirror-state").EditorState<any>) => FindReplacePluginState)) => import("prosemirror-state").SafeStateField<FindReplacePluginState, import("prosemirror-model").Schema<any, any>>;
export declare const createPlugin: (dispatch: Dispatch) => SafePlugin<FindReplacePluginState, import("prosemirror-model").Schema<any, any>>;
