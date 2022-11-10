import React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import PropTypes from 'prop-types';
import { EditorView } from 'prosemirror-view';
import { SmartCardProps } from './genericCard';
import { ReactNodeView, getPosHandler } from '../../../nodeviews/';
export interface Props {
    children?: React.ReactNode;
    node: PMNode;
    view: EditorView;
    getPos: getPosHandler;
}
export declare class BlockCardComponent extends React.PureComponent<SmartCardProps> {
    private scrollContainer?;
    onClick: () => void;
    static contextTypes: {
        contextAdapter: PropTypes.Requireable<object>;
    };
    UNSAFE_componentWillMount(): void;
    onResolve: (data: {
        url?: string | undefined;
        title?: string | undefined;
    }) => void;
    gapCursorSpan: () => JSX.Element | undefined;
    render(): JSX.Element;
}
export declare type BlockCardNodeViewProps = Pick<SmartCardProps, 'platform'>;
export declare class BlockCard extends ReactNodeView<BlockCardNodeViewProps> {
    createDomRef(): HTMLElement;
    render(): JSX.Element;
}
