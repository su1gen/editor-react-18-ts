import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { PluginKey } from 'prosemirror-state';
import { DecorationSet } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { Dispatch } from '../../../event-dispatcher';
import { ListState } from '../types';
export declare const pluginKey: PluginKey<ListState, any>;
export declare const getDecorations: (doc: Node) => DecorationSet;
export declare const createPlugin: (eventDispatch: Dispatch) => SafePlugin;
