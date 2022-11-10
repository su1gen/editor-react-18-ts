/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { EditorAppearanceComponentProps } from '../../types';
export interface ChromelessEditorProps {
    isMaxContentSizeReached?: boolean;
    maxHeight?: number;
    minHeight?: number;
}
export default class Editor extends React.Component<EditorAppearanceComponentProps, any> {
    static displayName: string;
    private appearance;
    private containerElement;
    private renderChrome;
    render(): jsx.JSX.Element;
}
