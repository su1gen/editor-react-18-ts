import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState } from 'prosemirror-state';
interface CompositionPluginState {
    isComposing: boolean;
}
export declare const isComposing: (state: EditorState) => any;
declare const _default: () => SafePlugin<CompositionPluginState, any>;
export default _default;
