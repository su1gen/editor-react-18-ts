import { IntlShape } from 'react-intl-next';
import { EditorView, NodeView, Decoration } from 'prosemirror-view';
import { Node as PmNode } from 'prosemirror-model';
import { getPosHandlerNode, getPosHandler } from '../../../nodeviews/';
export declare class ExpandNodeView implements NodeView {
    node: PmNode;
    view: EditorView;
    dom?: HTMLElement;
    contentDOM?: HTMLElement;
    icon?: HTMLElement | null;
    input?: HTMLInputElement | null;
    titleContainer?: HTMLElement | null;
    content?: HTMLElement | null;
    getPos: getPosHandlerNode;
    pos: number;
    intl: IntlShape;
    allowInteractiveExpand: boolean;
    isMobile: boolean;
    constructor(node: PmNode, view: EditorView, getPos: getPosHandlerNode, getIntl: () => IntlShape, isMobile: boolean);
    private initHandlers;
    private focusTitle;
    private handleIconKeyDown;
    private renderIcon;
    private isAllowInteractiveExpandEnabled;
    private handleClick;
    private handleInput;
    private handleFocus;
    private handleTitleKeydown;
    private deleteExpand;
    private toggleExpand;
    private moveToOutsideOfTitle;
    private isCollapsed;
    private setRightGapCursor;
    private setLeftGapCursor;
    private handleArrowRightFromTitle;
    private handleArrowLeftFromTitle;
    stopEvent(event: Event): boolean;
    ignoreMutation(mutationRecord: MutationRecord | {
        type: 'selection';
        target: Element;
    }): boolean;
    update(node: PmNode, _decorations: Array<Decoration>): boolean;
    destroy(): void;
}
export default function ({ getIntl, isMobile, }: {
    getIntl: () => IntlShape;
    isMobile: boolean;
}): (node: PmNode, view: EditorView, getPos: getPosHandler) => NodeView;
