import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { Dispatch } from '../../../event-dispatcher';
export declare type StateChangeHandler = (state: ClearFormattingState) => any;
export interface ClearFormattingState {
    formattingIsPresent?: boolean;
}
export declare const pluginKey: PluginKey<ClearFormattingState, any>;
export declare const plugin: (dispatch: Dispatch) => SafePlugin<any, any>;
