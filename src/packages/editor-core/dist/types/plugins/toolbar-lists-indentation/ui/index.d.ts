/** @jsx jsx */
import { jsx } from '@emotion/react';
import { EditorView } from 'prosemirror-view';
export interface Props {
    editorView: EditorView;
    bulletListActive?: boolean;
    bulletListDisabled?: boolean;
    orderedListActive?: boolean;
    orderedListDisabled?: boolean;
    disabled?: boolean;
    isSmall?: boolean;
    isReducedSpacing?: boolean;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
    showIndentationButtons?: boolean;
    indentDisabled?: boolean;
    outdentDisabled?: boolean;
}
export default function ToolbarListsIndentation(props: Props): jsx.JSX.Element;
