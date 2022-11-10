/** @jsx jsx */
import React from 'react';
import { jsx } from '@emotion/react';
export interface Props {
    animate: boolean;
    children?: any;
}
export default class WithFlash extends React.Component<Props> {
    private toggle;
    render(): jsx.JSX.Element;
}
