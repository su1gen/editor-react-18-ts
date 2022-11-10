/// <reference types="react" />
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import type { ExtensionProvider } from '@atlaskit/editor-common/extensions';
interface Props {
    node: PMNode;
    extensionProvider: ExtensionProvider;
    editorView: EditorView;
    separator?: 'start' | 'end' | 'both';
}
export declare const ExtensionsPlaceholder: (props: Props) => JSX.Element | null;
export {};
