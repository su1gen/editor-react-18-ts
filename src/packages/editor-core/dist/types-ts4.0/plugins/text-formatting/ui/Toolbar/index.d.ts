/** @jsx jsx */
import React from 'react';
import { EditorView } from 'prosemirror-view';
import { EditorState } from 'prosemirror-state';
import { WrappedComponentProps } from 'react-intl-next';
import { ToolbarSize } from '../../../../ui/Toolbar/types';
export declare type ToolbarFormattingProps = {
    editorView: EditorView;
    isToolbarDisabled: boolean;
    toolbarSize: ToolbarSize;
    isReducedSpacing: boolean;
    shouldUseResponsiveToolbar: boolean;
    popupsMountPoint?: HTMLElement;
    popupsBoundariesElement?: HTMLElement;
    popupsScrollableElement?: HTMLElement;
};
declare const _default: React.FC<import("react-intl-next").WithIntlProps<ToolbarFormattingProps & WrappedComponentProps<"intl"> & {
    editorState: EditorState<any>;
}>> & {
    WrappedComponent: React.ComponentType<ToolbarFormattingProps & WrappedComponentProps<"intl"> & {
        editorState: EditorState<any>;
    }>;
};
export default _default;
