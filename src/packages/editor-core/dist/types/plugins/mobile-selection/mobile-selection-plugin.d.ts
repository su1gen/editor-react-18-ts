import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { Dispatch } from '../../event-dispatcher';
import { EditorPlugin } from '../../types';
export declare const selectionPluginKey: PluginKey<any, any>;
export declare const createProseMirrorPlugin: (dispatch: Dispatch) => SafePlugin;
export declare const mobileSelectionPlugin: () => EditorPlugin;
