/// <reference types="react" />
import { EditorView, NodeView } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { EditorAppearance } from '../../../types/editor-appearance';
import { ForwardRef, getPosHandler, ReactNodeView } from '../../../nodeviews';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { EventDispatcher } from '../../../event-dispatcher';
interface ExtensionNodeViewOptions {
    appearance?: EditorAppearance;
}
export interface Props {
    node: PmNode;
    providerFactory: ProviderFactory;
    view: EditorView;
}
export declare class ExtensionNode extends ReactNodeView {
    ignoreMutation(mutation: MutationRecord | {
        type: 'selection';
        target: Element;
    }): boolean;
    getContentDOM(): {
        dom: HTMLDivElement;
    } | undefined;
    render(props: {
        providerFactory: ProviderFactory;
        extensionHandlers: ExtensionHandlers;
        extensionNodeViewOptions?: ExtensionNodeViewOptions;
    }, forwardRef: ForwardRef): JSX.Element;
}
export default function ExtensionNodeView(portalProviderAPI: PortalProviderAPI, eventDispatcher: EventDispatcher, providerFactory: ProviderFactory, extensionHandlers: ExtensionHandlers, extensionNodeViewOptions: ExtensionNodeViewOptions): (node: PmNode, view: EditorView, getPos: getPosHandler) => NodeView;
export {};
