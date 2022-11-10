import { ExtensionAPI } from '@atlaskit/editor-common/extensions';
import type { EditorView } from 'prosemirror-view';
import { MacroProvider } from '../macro';
interface EditInLegacyMacroBrowserArgs {
    view: EditorView;
    macroProvider?: MacroProvider;
}
export declare const getEditInLegacyMacroBrowser: ({ view, macroProvider, }: EditInLegacyMacroBrowserArgs) => () => void;
interface CreateExtensionAPIOptions {
    editorView: EditorView;
    editInLegacyMacroBrowser?: () => void;
}
export declare const createExtensionAPI: (options: CreateExtensionAPIOptions) => ExtensionAPI;
export {};
