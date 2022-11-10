import { EditorView } from 'prosemirror-view';
import { QuickInsertItem } from '@atlaskit/editor-common/provider-factory';
import type { QuickInsertPluginOptions } from './types';
export declare const createQuickInsertTools: (editorView: EditorView) => {
    getItems: (query: string, options?: QuickInsertPluginOptions | undefined) => QuickInsertItem[];
};
