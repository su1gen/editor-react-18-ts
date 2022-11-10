/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { EditorView } from 'prosemirror-view';
export interface Props {
    editorView?: EditorView;
    children?: any;
    editorDisabled?: boolean;
}
export default class ClickAreaBlock extends React.Component<Props> {
    private handleClick;
    render(): jsx.JSX.Element;
}
