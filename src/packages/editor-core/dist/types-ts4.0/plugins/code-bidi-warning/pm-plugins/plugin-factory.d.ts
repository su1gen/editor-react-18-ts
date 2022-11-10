import { DecorationSet } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
export declare const createPluginState: (dispatch: import("@atlaskit/editor-common/event-dispatcher").Dispatch<any>, initialState: import("./types").CodeBidiWarningPluginState | ((state: import("prosemirror-state").EditorState<any>) => import("./types").CodeBidiWarningPluginState)) => import("prosemirror-state").SafeStateField<import("./types").CodeBidiWarningPluginState, import("prosemirror-model").Schema<any, any>>, getPluginState: (state: import("prosemirror-state").EditorState<any>) => import("./types").CodeBidiWarningPluginState;
export declare function createBidiWarningsDecorationSetFromDoc({ doc, codeBidiWarningLabel, tooltipEnabled, }: {
    doc: PmNode<any>;
    codeBidiWarningLabel: string;
    tooltipEnabled: boolean;
}): DecorationSet<any>;
