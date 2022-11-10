import { NodeType } from 'prosemirror-model';
import { Decoration } from 'prosemirror-view';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { Command } from '../../../types';
export declare const decorationStateKey: PluginKey<any, any>;
export declare enum ACTIONS {
    DECORATION_ADD = 0,
    DECORATION_REMOVE = 1
}
export declare const hoverDecoration: (nodeType: NodeType | Array<NodeType>, add: boolean, className?: string) => Command;
export declare type DecorationState = {
    decoration?: Decoration;
};
declare const _default: () => SafePlugin<DecorationState, any>;
export default _default;
