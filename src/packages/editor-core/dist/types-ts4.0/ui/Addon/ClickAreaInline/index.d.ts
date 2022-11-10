/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { EditorView } from 'prosemirror-view';
export interface Props {
    editorView?: EditorView;
}
export default class ClickAreaInline extends React.Component<Props> {
    private handleClick;
    render(): jsx.JSX.Element;
}
