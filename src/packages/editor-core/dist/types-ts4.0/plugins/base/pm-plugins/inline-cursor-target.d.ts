import { Decoration } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
export declare const inlineCursorTargetStateKey: PluginKey<any, any>;
export declare const isInlineNodeView: (node: Node | null | undefined) => boolean | null | undefined;
export interface InlineCursorTargetState {
    cursorTarget?: {
        decorations: (Decoration | null)[];
        positions: {
            from: number;
            to: number;
        };
    };
}
declare const _default: () => SafePlugin<InlineCursorTargetState, any>;
export default _default;
