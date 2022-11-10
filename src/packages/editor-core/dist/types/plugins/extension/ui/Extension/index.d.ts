import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import type { ExtensionHandlers, ReferenceEntity } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { ProsemirrorGetPosHandler } from '../../../../nodeviews/types';
import { EditorAppearance } from '../../../../types/editor-appearance';
export interface Props {
    editorView: EditorView;
    node: PMNode;
    getPos: ProsemirrorGetPosHandler;
    providerFactory?: ProviderFactory;
    handleContentDOMRef: (node: HTMLElement | null) => void;
    extensionHandlers: ExtensionHandlers;
    references?: ReferenceEntity[];
    editorAppearance?: EditorAppearance;
}
export default class Extension extends Component<Props, any> {
    static displayName: string;
    private providerFactory;
    constructor(props: Props);
    componentWillUnmount(): void;
    private renderWithProvider;
    render(): JSX.Element;
}
