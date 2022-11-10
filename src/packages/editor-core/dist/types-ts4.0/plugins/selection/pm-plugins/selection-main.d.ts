import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorState } from 'prosemirror-state';
import { Dispatch } from '../../../event-dispatcher';
import { DispatchAnalyticsEvent } from '../../analytics';
import { SelectionPluginOptions, SelectionPluginState } from '../types';
export declare const getInitialState: (state: EditorState) => SelectionPluginState;
export declare const createPlugin: (dispatch: Dispatch, dispatchAnalyticsEvent: DispatchAnalyticsEvent, options?: SelectionPluginOptions) => SafePlugin<SelectionPluginState, import("prosemirror-model").Schema<any, any>>;
