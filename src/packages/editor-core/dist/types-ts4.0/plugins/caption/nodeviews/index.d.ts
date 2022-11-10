/// <reference types="react" />
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { getPosHandler, ForwardRef, SelectionBasedNodeView } from '../../../nodeviews/';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { EventDispatcher } from '../../../event-dispatcher';
export declare class CaptionNodeView extends SelectionBasedNodeView {
    private selected;
    createDomRef(): HTMLElement;
    getContentDOM(): {
        dom: HTMLDivElement;
    };
    render(_props: never, forwardRef: ForwardRef): JSX.Element;
    viewShouldUpdate(nextNode: PMNode): boolean;
}
export default function captionNodeView(portalProviderAPI: PortalProviderAPI, eventDispatcher: EventDispatcher): (node: PMNode, view: EditorView, getPos: getPosHandler) => CaptionNodeView;
