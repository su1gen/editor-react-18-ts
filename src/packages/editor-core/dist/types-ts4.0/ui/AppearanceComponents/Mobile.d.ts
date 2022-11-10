/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { EditorView } from 'prosemirror-view';
export interface MobileEditorProps {
    isMaxContentSizeReached?: boolean;
    maxHeight?: number;
}
export declare type MobileAppearanceProps = React.PropsWithChildren<{
    editorView: EditorView | null;
    maxHeight?: number;
    persistScrollGutter?: boolean;
    editorDisabled?: boolean;
}>;
export declare function MobileAppearance({ editorView, persistScrollGutter, children, editorDisabled, }: MobileAppearanceProps): jsx.JSX.Element;
