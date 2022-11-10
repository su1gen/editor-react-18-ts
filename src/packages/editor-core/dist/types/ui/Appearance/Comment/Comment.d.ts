/** @jsx jsx */
import React from 'react';
import { EditorAppearanceComponentProps } from '../../../types';
import { WrappedComponentProps } from 'react-intl-next';
export interface CommentEditorProps {
    isMaxContentSizeReached?: boolean;
    maxHeight?: number;
    minHeight?: number;
}
export interface EditorAppearanceComponentState {
}
export declare const CommentEditorWithIntl: React.FC<import("react-intl-next").WithIntlProps<EditorAppearanceComponentProps & WrappedComponentProps<"intl">>> & {
    WrappedComponent: React.ComponentType<EditorAppearanceComponentProps & WrappedComponentProps<"intl">>;
};
