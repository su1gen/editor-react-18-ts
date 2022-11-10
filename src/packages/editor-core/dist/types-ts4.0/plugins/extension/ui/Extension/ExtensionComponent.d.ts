import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { getNodeRenderer, getExtensionModuleNodePrivateProps } from '@atlaskit/editor-common/extensions';
import type { ExtensionHandlers, ExtensionProvider, ReferenceEntity } from '@atlaskit/editor-common/extensions';
import { ProsemirrorGetPosHandler } from '../../../../nodeviews';
import { EditorAppearance } from '../../../../types/editor-appearance';
export interface Props {
    editorView: EditorView;
    node: PMNode;
    getPos: ProsemirrorGetPosHandler;
    handleContentDOMRef: (node: HTMLElement | null) => void;
    extensionHandlers: ExtensionHandlers;
    extensionProvider?: Promise<ExtensionProvider>;
    references?: ReferenceEntity[];
    editorAppearance?: EditorAppearance;
}
export interface State {
    extensionProvider?: ExtensionProvider;
    extensionHandlersFromProvider?: ExtensionHandlers;
    _privateProps?: {
        __hideFrame?: boolean;
    };
}
export default class ExtensionComponent extends Component<Props, State> {
    private privatePropsParsed;
    state: State;
    mounted: boolean;
    UNSAFE_componentWillMount(): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    UNSAFE_componentWillReceiveProps(nextProps: Props): void;
    getNodeRenderer: import("memoize-one").MemoizedFn<typeof getNodeRenderer>;
    getExtensionModuleNodePrivateProps: import("memoize-one").MemoizedFn<typeof getExtensionModuleNodePrivateProps>;
    render(): JSX.Element | null;
    private setStateFromPromise;
    /**
     * Parses any private nodes once an extension provider is available.
     *
     * We do this separately from resolving a node renderer component since the
     * private props come from extension provider, rather than an extension
     * handler which only handles `render`/component concerns.
     */
    private parsePrivateNodePropsIfNeeded;
    private tryExtensionHandler;
    private handleExtension;
}
