import { InlineCommentPluginState } from './types';
export declare const createPluginState: (dispatch: import("@atlaskit/editor-common/event-dispatcher").Dispatch<any>, initialState: InlineCommentPluginState | ((state: import("prosemirror-state").EditorState<any>) => InlineCommentPluginState)) => import("prosemirror-state").SafeStateField<InlineCommentPluginState, import("prosemirror-model").Schema<any, any>>, createCommand: <A = import("./types").InlineCommentAction>(action: A | ((state: Readonly<import("prosemirror-state").EditorState<any>>) => false | A), transform?: ((tr: import("prosemirror-state").Transaction<any>, state: import("prosemirror-state").EditorState<any>) => import("prosemirror-state").Transaction<any>) | undefined) => import("@atlaskit/editor-common/types").Command;
