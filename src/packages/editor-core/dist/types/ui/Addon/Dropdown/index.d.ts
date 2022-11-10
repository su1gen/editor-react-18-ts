/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { RenderOnClickHandler } from '../../Addon/types';
import EditorActions from '../../../actions';
export interface Props {
    onClick: (actionOnClick: EditorActions, renderOnClick: RenderOnClickHandler) => void;
    editorActions: EditorActions;
    togglePopup: () => void;
}
export default class DropdownWrapper extends React.Component<Props, any> {
    render(): jsx.JSX.Element;
    private handleClick;
}
