/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { EditorAppearanceComponentProps } from '../../../types';
interface FullPageEditorState {
    showKeyline: boolean;
}
export declare class FullPageEditor extends React.Component<EditorAppearanceComponentProps, FullPageEditorState> {
    state: FullPageEditorState;
    static displayName: string;
    private scrollContainer;
    private contentArea;
    private wrapperElementRef;
    constructor(props: any);
    private contentAreaRef;
    private scrollContainerRef;
    private updateToolbarKeyline;
    private handleResize;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): jsx.JSX.Element;
}
export {};
