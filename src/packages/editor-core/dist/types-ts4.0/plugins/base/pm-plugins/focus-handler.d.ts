import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { Dispatch } from '../../../event-dispatcher';
export declare const focusStateKey: PluginKey<any, any>;
declare const _default: (dispatch: Dispatch) => SafePlugin<boolean, any>;
export default _default;
