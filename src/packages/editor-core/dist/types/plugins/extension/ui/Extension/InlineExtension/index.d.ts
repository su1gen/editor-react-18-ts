/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
import { Component } from 'react';
import { Node as PmNode } from 'prosemirror-model';
export interface Props {
    node: PmNode;
    children?: React.ReactNode;
}
export default class InlineExtension extends Component<Props, any> {
    render(): jsx.JSX.Element;
}
